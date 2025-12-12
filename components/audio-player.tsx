
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

export default function AudioPlayer({ musics, onRefresh }: AudioPlayerProps) {
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Carousel drag state
  const carouselRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const dragStartTime = useRef<number>(0)
  const dragDistance = useRef<number>(0)
  const lastX = useRef<number>(0)
  const velocityX = useRef<number>(0)
  const momentumAnimation = useRef<number | null>(null)
  const clickBlockedUntil = useRef<number>(0)
  const [isDragging, setIsDragging] = useState(false) // Apenas para CSS

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

  // Carousel drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return
    
    // Cancelar animação de momentum se estiver em andamento
    if (momentumAnimation.current) {
      cancelAnimationFrame(momentumAnimation.current)
      momentumAnimation.current = null
    }
    
    // Prevenir comportamento padrão de arraste de imagem
    e.preventDefault()
    
    isDraggingRef.current = true
    hasDraggedRef.current = false
    setIsDragging(true)
    dragStartTime.current = Date.now()
    dragDistance.current = 0
    velocityX.current = 0
    
    const x = e.pageX - carouselRef.current.offsetLeft
    lastX.current = x
    startXRef.current = x
    scrollLeftRef.current = carouselRef.current.scrollLeft
    
    // Adicionar cursor grabbing
    carouselRef.current.style.cursor = 'grabbing'
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return
    
    e.preventDefault()
    
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    
    // Calcular velocidade para momentum
    velocityX.current = x - lastX.current
    lastX.current = x
    
    // Acumular distância total do drag
    const currentDistance = Math.abs(walk)
    if (currentDistance > dragDistance.current) {
      dragDistance.current = currentDistance
    }
    
    // Considera drag se moveu mais de 5px
    if (dragDistance.current > 5) {
      hasDraggedRef.current = true
    }
    
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk
  }, [])

  // Função de momentum/inércia
  const applyMomentum = useCallback(() => {
    if (!carouselRef.current || Math.abs(velocityX.current) < 0.5) {
      velocityX.current = 0
      return
    }
    
    carouselRef.current.scrollLeft -= velocityX.current * 2
    velocityX.current *= 0.92 // Decaimento da velocidade
    
    momentumAnimation.current = requestAnimationFrame(applyMomentum)
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!carouselRef.current || !isDraggingRef.current) return
    
    const wasDragging = hasDraggedRef.current
    
    isDraggingRef.current = false
    setIsDragging(false)
    carouselRef.current.style.cursor = 'grab'
    
    // Se houve drag significativo, bloqueia clicks por um tempo
    if (wasDragging || dragDistance.current > 5) {
      clickBlockedUntil.current = Date.now() + 150
      
      // Aplicar momentum se houve velocidade suficiente
      if (Math.abs(velocityX.current) > 1.5 && dragDistance.current > 15) {
        if (momentumAnimation.current) {
          cancelAnimationFrame(momentumAnimation.current)
        }
        applyMomentum()
      }
    }
    
    // Reset
    setTimeout(() => {
      hasDraggedRef.current = false
      dragDistance.current = 0
      velocityX.current = 0
    }, 50)
  }, [applyMomentum])

  const handleMouseLeave = useCallback(() => {
    if (!carouselRef.current || !isDraggingRef.current) return
    
    const wasDragging = hasDraggedRef.current
    
    isDraggingRef.current = false
    setIsDragging(false)
    carouselRef.current.style.cursor = 'grab'
    
    // Se houve drag, bloqueia clicks
    if (wasDragging || dragDistance.current > 5) {
      clickBlockedUntil.current = Date.now() + 150
      
      // Aplicar momentum
      if (Math.abs(velocityX.current) > 1.5 && dragDistance.current > 15) {
        if (momentumAnimation.current) {
          cancelAnimationFrame(momentumAnimation.current)
        }
        applyMomentum()
      }
    }
    
    // Reset
    setTimeout(() => {
      hasDraggedRef.current = false
      dragDistance.current = 0
      velocityX.current = 0
    }, 100)
  }, [applyMomentum])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return
    
    // Cancelar animação de momentum se estiver em andamento
    if (momentumAnimation.current) {
      cancelAnimationFrame(momentumAnimation.current)
      momentumAnimation.current = null
    }
    
    isDraggingRef.current = true
    hasDraggedRef.current = false
    setIsDragging(true)
    dragStartTime.current = Date.now()
    dragDistance.current = 0
    velocityX.current = 0
    
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    lastX.current = x
    startXRef.current = x
    scrollLeftRef.current = carouselRef.current.scrollLeft
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return
    
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5
    
    // Calcular velocidade para momentum
    velocityX.current = x - lastX.current
    lastX.current = x
    
    // Acumular distância total do drag
    const currentDistance = Math.abs(walk)
    if (currentDistance > dragDistance.current) {
      dragDistance.current = currentDistance
    }
    
    // Considera drag se moveu mais de 8px no mobile
    if (dragDistance.current > 8) {
      hasDraggedRef.current = true
    }
    
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return
    
    const wasDragging = hasDraggedRef.current
    
    isDraggingRef.current = false
    setIsDragging(false)
    
    // Se houve drag, bloqueia clicks por um tempo
    if (wasDragging || dragDistance.current > 8) {
      clickBlockedUntil.current = Date.now() + 200
      
      // Aplicar momentum se houve velocidade suficiente (mobile mais sensível)
      if (Math.abs(velocityX.current) > 1 && dragDistance.current > 10) {
        if (momentumAnimation.current) {
          cancelAnimationFrame(momentumAnimation.current)
        }
        applyMomentum()
      }
    }
    
    // Reset
    setTimeout(() => {
      hasDraggedRef.current = false
      dragDistance.current = 0
      velocityX.current = 0
    }, 100)
  }, [applyMomentum])

  // Handler para click nos cards do carousel
  const handleCardClick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    
    // Verifica se clicks estão bloqueados (após drag)
    if (Date.now() < clickBlockedUntil.current) {
      return
    }
    
    // Verifica se houve drag recente
    if (hasDraggedRef.current || dragDistance.current > 5) {
      return
    }
    
    // Executa a seleção da música
    setCurrentMusicIndex(index)
    setIsPlaying(true)
  }, [])

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

  // Navigation functions for carousel
  const scrollCarouselLeft = () => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: -300,
      behavior: 'smooth'
    })
  }

  const scrollCarouselRight = () => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: 300,
      behavior: 'smooth'
    })
  }

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
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div 
              ref={carouselRef}
              className={`carousel-container ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ 
                cursor: 'grab',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'pan-y pinch-zoom'
              }}
            >
            {filteredMusics.map((music, index) => (
              <div
                key={music.id}
                className={`carousel-card ${index === currentMusicIndex ? 'active' : ''}`}
                onClick={(e) => handleCardClick(e, index)}
                onDragStart={(e) => e.preventDefault()}
                style={{ userSelect: 'none' }}
              >
                <div className="carousel-card-cover">
                  {music.coverUrl ? (
                    <img 
                      src={music.coverUrl} 
                      alt={`Capa de ${music.title}`}
                      draggable={false}
                    />
                  ) : (
                    <div className="carousel-default-cover">
                      <i className="fas fa-music"></i>
                    </div>
                  )}
                  {index === currentMusicIndex && isPlaying && (
                    <div className="carousel-playing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
                <div className="carousel-card-info">
                  <div className="carousel-card-title">{music.title}</div>
                  <div className="carousel-card-artist">{music.artist}</div>
                </div>
              </div>
            ))}
          </div>

            {/* Botão Próximo */}
            <button 
              className="carousel-nav-btn carousel-nav-right"
              onClick={scrollCarouselRight}
              aria-label="Navegar para direita"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
