
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Music {
  id: number
  title: string
  artist: string
  url: string
  coverUrl?: string | null
  duration?: number | null
}

interface AudioPlayerProps {
  musics: Music[]
  onRefresh?: () => void
}

// Configurações do carrossel - otimizadas para melhor experiência
const CAROUSEL_CONFIG = {
  // Threshold mínimo de movimento para considerar drag (em pixels) - aumentado para evitar clicks acidentais
  DRAG_THRESHOLD: 8,
  // Multiplicador de velocidade para o arraste
  DRAG_SPEED: 1.2,
  // Tempo de bloqueio de clicks após drag (ms)
  CLICK_BLOCK_TIME: 200,
  // Configurações de momentum
  MOMENTUM_FRICTION: 0.94,
  MOMENTUM_MIN_VELOCITY: 0.3,
  // Tempo máximo entre posições para calcular velocidade (ms)
  MAX_VELOCITY_TIME: 100,
}

export default function AudioPlayer({ musics, onRefresh }: AudioPlayerProps) {
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Carousel drag state - usando refs para evitar re-renders durante drag
  const carouselRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const isMouseDownRef = useRef(false) // Novo: rastrear se o mouse está pressionado
  const startXRef = useRef(0)
  const startYRef = useRef(0) // Novo: para detectar scroll vertical
  const scrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const dragDistanceRef = useRef(0)
  const dragStartTime = useRef(0) // Novo: tempo de início do drag

  // Momentum animation
  const momentumAnimation = useRef<number | null>(null)
  const momentumVelocity = useRef(0)
  const lastPositions = useRef<Array<{ x: number; time: number }>>([])

  // Controle de clicks
  const clickBlockedUntil = useRef<number>(0)

  // Estado visual do dragging (separado do ref para performance)
  const [isDraggingVisual, setIsDraggingVisual] = useState(false)

  // Only keep tracks that look like they're coming from the AWS S3 bucket
  // This prevents any old/example tracks from appearing in the player's playlist.
  const AWS_URL_PATTERN = /amazonaws\.com|s3\.amazonaws\.com|s3\./i
  const filteredMusics = musics.filter((m) => !!m.url && AWS_URL_PATTERN.test(m.url))

  const currentMusic = filteredMusics[currentMusicIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleEnded = () => {
      if (currentMusicIndex < filteredMusics.length - 1) {
        setCurrentMusicIndex(currentMusicIndex + 1)
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    }
    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }
    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }
    const handleError = () => {
      setIsLoading(false)
      setError('Erro ao carregar o áudio. A URL pode ter expirado. Tente atualizar a lista.')
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    // Auto-play when track changes
    if (isPlaying) {
      audio.play().catch(err => {
        console.log('Playback error:', err)
        setError('Erro ao reproduzir o áudio. Tente novamente.')
        setIsPlaying(false)
      })
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [currentMusicIndex, isPlaying, filteredMusics.length])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    // 1. Garante que se a lista encolheu ou está vazia, o índice seja 0.
    // If there are no valid AWS tracks, reset player state
    if (filteredMusics.length === 0 || currentMusicIndex >= filteredMusics.length) {
      setCurrentMusicIndex(0)
      setIsPlaying(false)
      // Pausa o áudio e reseta o tempo para o início
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
    // 2. Se o índice atual for a última música e o `musics.length` mudar,
    // ele reinicia o estado para evitar a exibição de dados incorretos.

  }, [musics, currentMusicIndex])

  // Cleanup momentum animation on unmount
  useEffect(() => {
    return () => {
      if (momentumAnimation.current) {
        cancelAnimationFrame(momentumAnimation.current)
      }
    }
  }, [])

  // Função de momentum/inércia melhorada
  const applyMomentum = useCallback(() => {
    if (!carouselRef.current) {
      momentumVelocity.current = 0
      return
    }

    // Parar se velocidade for muito baixa
    if (Math.abs(momentumVelocity.current) < CAROUSEL_CONFIG.MOMENTUM_MIN_VELOCITY) {
      momentumVelocity.current = 0
      momentumAnimation.current = null
      return
    }

    // Aplicar velocidade
    const newScrollLeft = carouselRef.current.scrollLeft + momentumVelocity.current
    carouselRef.current.scrollLeft = newScrollLeft

    // Aplicar fricção
    momentumVelocity.current *= CAROUSEL_CONFIG.MOMENTUM_FRICTION

    // Verificar limites do scroll
    const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth
    const currentScroll = carouselRef.current.scrollLeft

    // Parar no final/início
    if (currentScroll <= 0 || currentScroll >= maxScroll) {
      momentumVelocity.current = 0
      momentumAnimation.current = null
      return
    }

    momentumAnimation.current = requestAnimationFrame(applyMomentum)
  }, [])

  // Cancelar momentum quando necessário
  const cancelMomentum = useCallback(() => {
    if (momentumAnimation.current) {
      cancelAnimationFrame(momentumAnimation.current)
      momentumAnimation.current = null
    }
    momentumVelocity.current = 0
  }, [])

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentMusicIndex < filteredMusics.length - 1) {
      setCurrentMusicIndex(currentMusicIndex + 1)
      setIsPlaying(true)
    } else {
      setCurrentMusicIndex(0)
      setIsPlaying(false)
    }
  }

  const handlePrevious = () => {
    if (currentMusicIndex > 0) {
      setCurrentMusicIndex(currentMusicIndex - 1)
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
  }

  // ============================================
  // CAROUSEL DRAG HANDLERS - VERSÃO ROBUSTA
  // ============================================

  // Função auxiliar para calcular velocidade com base no histórico
  const calculateVelocity = useCallback(() => {
    if (lastPositions.current.length < 2) return 0

    const now = Date.now()
    // Filtrar posições muito antigas
    const recentPositions = lastPositions.current.filter(
      p => now - p.time < CAROUSEL_CONFIG.MAX_VELOCITY_TIME
    )

    if (recentPositions.length < 2) {
      const latest = lastPositions.current[lastPositions.current.length - 1]
      const previous = lastPositions.current[lastPositions.current.length - 2]
      const timeDiff = latest.time - previous.time
      if (timeDiff <= 0) return 0
      return -(latest.x - previous.x) / timeDiff * 16
    }

    const first = recentPositions[0]
    const last = recentPositions[recentPositions.length - 1]
    const timeDiff = last.time - first.time
    if (timeDiff <= 0) return 0

    return -(last.x - first.x) / timeDiff * 16
  }, [])

  // Finalizar drag e aplicar momentum
  const finishDrag = useCallback(() => {
    if (!carouselRef.current) return

    const wasDragging = hasDraggedRef.current

    // Resetar refs
    isMouseDownRef.current = false
    isDraggingRef.current = false
    setIsDraggingVisual(false)

    // Restaurar cursor
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
    }

    // Se houve drag significativo, bloquear clicks e aplicar momentum
    if (wasDragging && lastPositions.current.length >= 2) {
      clickBlockedUntil.current = Date.now() + CAROUSEL_CONFIG.CLICK_BLOCK_TIME

      const velocity = calculateVelocity() * CAROUSEL_CONFIG.DRAG_SPEED

      // Aplicar momentum se tiver velocidade suficiente
      if (Math.abs(velocity) > 0.8) {
        momentumVelocity.current = velocity
        momentumAnimation.current = requestAnimationFrame(applyMomentum)
      }
    }

    // Limpar histórico
    lastPositions.current = []

    // Reset do drag flag após um delay
    setTimeout(() => {
      hasDraggedRef.current = false
      dragDistanceRef.current = 0
    }, CAROUSEL_CONFIG.CLICK_BLOCK_TIME + 50)
  }, [applyMomentum, calculateVelocity])

  // Handler global para mousemove (no document)
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isMouseDownRef.current || !carouselRef.current) return

    const x = e.pageX
    const deltaX = x - startXRef.current

    // Atualizar distância total arrastada
    dragDistanceRef.current = Math.abs(deltaX)

    // Considera drag se moveu mais que o threshold
    if (dragDistanceRef.current > CAROUSEL_CONFIG.DRAG_THRESHOLD) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true
        hasDraggedRef.current = true
        setIsDraggingVisual(true)

        // Adicionar classes para prevenir seleção
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'grabbing'
      }

      // Calcular nova posição do scroll
      const walk = -deltaX * CAROUSEL_CONFIG.DRAG_SPEED
      carouselRef.current.scrollLeft = scrollLeftRef.current + walk
    }

    // Manter histórico de posições (últimas 5 para cálculo de velocidade mais preciso)
    const now = Date.now()
    lastPositions.current.push({ x, time: now })
    if (lastPositions.current.length > 5) {
      lastPositions.current.shift()
    }
  }, [])

  // Handler global para mouseup (no document)
  const handleGlobalMouseUp = useCallback(() => {
    if (!isMouseDownRef.current) return

    // Remover estilos globais
    document.body.style.userSelect = ''
    document.body.style.cursor = ''

    finishDrag()
  }, [finishDrag])

  // Mouse handlers locais
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return

    // Ignorar clicks em botões de navegação
    if ((e.target as HTMLElement).closest('.carousel-nav-btn')) return

    // Ignorar botão direito
    if (e.button !== 0) return

    // Cancelar momentum existente
    cancelMomentum()

    // Prevenir comportamento padrão para evitar seleção de texto
    e.preventDefault()

    // Inicializar estado do drag
    isMouseDownRef.current = true
    isDraggingRef.current = false
    hasDraggedRef.current = false
    dragDistanceRef.current = 0
    dragStartTime.current = Date.now()

    startXRef.current = e.pageX
    scrollLeftRef.current = carouselRef.current.scrollLeft

    // Limpar histórico de posições
    lastPositions.current = [{ x: e.pageX, time: Date.now() }]

  }, [cancelMomentum])

  // Adicionar/remover event listeners globais
  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => handleGlobalMouseMove(e)
    const handleMouseUpGlobal = () => handleGlobalMouseUp()

    // Adicionar listeners no document para capturar movimento mesmo fora do carrossel
    document.addEventListener('mousemove', handleMouseMoveGlobal)
    document.addEventListener('mouseup', handleMouseUpGlobal)

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal)
      document.removeEventListener('mouseup', handleMouseUpGlobal)

      // Cleanup de estilos
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp])

  // ============================================
  // TOUCH HANDLERS PARA MOBILE
  // ============================================

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return

    // Cancelar momentum
    cancelMomentum()

    const touch = e.touches[0]

    // Inicializar estado
    isMouseDownRef.current = true
    isDraggingRef.current = false
    hasDraggedRef.current = false
    dragDistanceRef.current = 0
    dragStartTime.current = Date.now()

    startXRef.current = touch.pageX
    startYRef.current = touch.pageY
    scrollLeftRef.current = carouselRef.current.scrollLeft

    // Inicializar histórico de posições
    lastPositions.current = [{ x: touch.pageX, time: Date.now() }]
  }, [cancelMomentum])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMouseDownRef.current || !carouselRef.current) return

    const touch = e.touches[0]
    const x = touch.pageX
    const y = touch.pageY

    const deltaX = x - startXRef.current
    const deltaY = y - startYRef.current

    // Detectar direção do movimento
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

    // Atualizar distância total arrastada (apenas horizontal)
    dragDistanceRef.current = Math.abs(deltaX)

    // Considera drag se moveu mais que o threshold horizontalmente
    if (dragDistanceRef.current > CAROUSEL_CONFIG.DRAG_THRESHOLD && isHorizontal) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true
        hasDraggedRef.current = true
        setIsDraggingVisual(true)
      }

      // Prevenir scroll vertical apenas se estivermos arrastando horizontalmente
      e.preventDefault()

      // Calcular nova posição do scroll
      const walk = -deltaX * CAROUSEL_CONFIG.DRAG_SPEED
      carouselRef.current.scrollLeft = scrollLeftRef.current + walk
    }

    // Manter histórico de posições
    const now = Date.now()
    lastPositions.current.push({ x, time: now })
    if (lastPositions.current.length > 5) {
      lastPositions.current.shift()
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isMouseDownRef.current) return
    finishDrag()
  }, [finishDrag])

  // Handler para click nos cards do carousel - robusto e simples
  // Permite duplo clique para tocar imediatamente
  const handleCardClick = useCallback((index: number, event?: React.MouseEvent) => {
    if (Date.now() < clickBlockedUntil.current) return;
    if (hasDraggedRef.current || isDraggingRef.current) return;
    if (dragDistanceRef.current > CAROUSEL_CONFIG.DRAG_THRESHOLD) return;
    // Duplo clique sempre toca
    if (event && event.detail === 2) {
      setCurrentMusicIndex(index);
      setIsPlaying(true);
      return;
    }
    // Clique simples só seleciona se não for o atual
    if (index !== currentMusicIndex) {
      setCurrentMusicIndex(index);
      setIsPlaying(true);
    }
  }, [currentMusicIndex])

  // Scroll to current track in carousel
  const scrollToTrack = useCallback((index: number) => {
    if (!carouselRef.current) return
    const cards = carouselRef.current.querySelectorAll('.carousel-card')
    if (cards[index]) {
      const card = cards[index] as HTMLElement
      const containerWidth = carouselRef.current.offsetWidth
      const cardWidth = card.offsetWidth
      const scrollPosition = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2)
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  // Navigation functions for carousel (looping)
  const scrollCarouselLeft = () => {
    if (!carouselRef.current) return;
    if (currentMusicIndex === 0) {
      setCurrentMusicIndex(filteredMusics.length - 1);
      setIsPlaying(true);
      return;
    }
    carouselRef.current.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
    setCurrentMusicIndex((prev) => (prev > 0 ? prev - 1 : filteredMusics.length - 1));
    setIsPlaying(true);
  };

  const scrollCarouselRight = () => {
    if (!carouselRef.current) return;
    if (currentMusicIndex === filteredMusics.length - 1) {
      setCurrentMusicIndex(0);
      setIsPlaying(true);
      return;
    }
    carouselRef.current.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
    setCurrentMusicIndex((prev) => (prev < filteredMusics.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  // Scroll to current track when it changes
  useEffect(() => {
    scrollToTrack(currentMusicIndex)
  }, [currentMusicIndex, scrollToTrack])

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (filteredMusics.length === 0) {
    return (
      <div className="portfolio-player">
        <i className="fas fa-music"></i>
        <h3>Portfólio Musical</h3>
        <p>Nenhuma música disponível do bucket AWS no momento.</p>
        <p className="text-sm opacity-75">Verifique se o upload foi concluído ou atualize a lista.</p>
        {onRefresh && (
          <button onClick={onRefresh} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <i className="fas fa-sync-alt"></i> Atualizar Lista
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="audio-player-container">
      <audio ref={audioRef} src={currentMusic?.url} />

      {/* Cover Image */}
      <div className="player-cover-container">
        {currentMusic?.coverUrl ? (
          <img
            src={currentMusic.coverUrl}
            alt={`Capa de ${currentMusic.title}`}
            className="player-cover-image"
          />
        ) : (
          <div className="default-cover">
            <i className="fas fa-music"></i>
          </div>
        )}
        {isLoading && (
          <div className="player-loading-overlay">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        )}
      </div>

      {/* Current Track Info */}
      <div className="player-track-info">
        <div className="track-title">{currentMusic?.title}</div>
        <div className="track-artist">{currentMusic?.artist}</div>
        {error && (
          <div className="player-error" style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="player-progress">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button
          onClick={handlePrevious}
          disabled={currentMusicIndex === 0}
          className="control-btn"
        >
          <i className="fas fa-step-backward"></i>
        </button>

        <button onClick={handlePlayPause} className="control-btn play-btn">
          <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
        </button>

        <button
          onClick={handleNext}
          disabled={currentMusicIndex === filteredMusics.length - 1}
          className="control-btn"
        >
          <i className="fas fa-step-forward"></i>
        </button>
      </div>

      {/* Volume Control */}
      <div className="player-volume">
        <i className="fas fa-volume-up"></i>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-bar"
        />
      </div>

      {/* Carousel de Produções */}
      {filteredMusics.length > 1 && (
        <div className="player-carousel-section">
          <h4><i className="fas fa-headphones"></i> Minhas Produções ({filteredMusics.length})</h4>
          <p className="carousel-hint">
            <i className="fas fa-hand-pointer"></i> Arraste ou use as setas para navegar
          </p>

          <div className="carousel-wrapper">
            {/* Botão Anterior */}
            <button
              className="carousel-nav-btn carousel-nav-left"
              onClick={scrollCarouselLeft}
              aria-label="Navegar para esquerda"
              type="button"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div
              ref={carouselRef}
              className={`carousel-container ${isDraggingVisual ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
              role="listbox"
              aria-label="Lista de músicas"
              tabIndex={0}
              aria-activedescendant={`carousel-card-${currentMusicIndex}`}
              style={{
                cursor: isDraggingVisual ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none' as 'none',
                msUserSelect: 'none' as 'none',
                // touchAction 'none' durante drag para evitar conflitos, 'pan-x' quando não está arrastando
                touchAction: isDraggingVisual ? 'none' : 'pan-x',
                // Desabilitar scroll-snap durante o arraste para movimento suave
                scrollSnapType: isDraggingVisual ? 'none' : 'x proximity',
                outline: 'none',
                // Prevenir qualquer seleção de texto dentro do carrossel
                WebkitTouchCallout: 'none' as 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  scrollCarouselLeft();
                  e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                  scrollCarouselRight();
                  e.preventDefault();
                } else if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(currentMusicIndex);
                  e.preventDefault();
                }
              }}
            >
              {filteredMusics.map((music, index) => {
                const isActive = index === currentMusicIndex;
                return (
                  <div
                    key={music.id}
                    id={`carousel-card-${index}`}
                    className={`carousel-card ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleCardClick(index, e)}
                    onDoubleClick={(e) => handleCardClick(index, e)}
                    onDragStart={(e) => e.preventDefault()}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    data-index={index}
                    data-active={isActive}
                    title={`${music.title} - ${music.artist}`}
                    style={{ scrollSnapAlign: 'center' }}
                  >
                    <div className="carousel-card-cover">
                      {music.coverUrl ? (
                        <img
                          src={music.coverUrl}
                          alt={`Capa de ${music.title}`}
                          draggable={false}
                          loading="lazy"
                          onDragStart={(e) => e.preventDefault()}
                          style={{
                            pointerEvents: 'none',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: isActive ? 'scale(1.05)' : 'scale(1)'
                          }}
                        />
                      ) : (
                        <div className="carousel-default-cover">
                          <i className="fas fa-music"></i>
                        </div>
                      )}
                      {isActive && isPlaying && (
                        <div className="carousel-playing-indicator" aria-label="Tocando agora">
                          <span style={{ animation: 'soundBars 0.5s ease infinite alternate, pulse 1.2s infinite' }}></span>
                          <span style={{ animation: 'soundBars 0.5s 0.2s ease infinite alternate, pulse 1.2s 0.2s infinite' }}></span>
                          <span style={{ animation: 'soundBars 0.5s 0.4s ease infinite alternate, pulse 1.2s 0.4s infinite' }}></span>
                        </div>
                      )}
                    </div>
                    <div className="carousel-card-info">
                      <div className="carousel-card-title">{music.title}</div>
                      <div className="carousel-card-artist">{music.artist}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botão Próximo */}
            <button
              className="carousel-nav-btn carousel-nav-right"
              onClick={scrollCarouselRight}
              aria-label="Navegar para direita"
              type="button"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
