
'use client'

import { useState, useRef, useEffect } from 'react'

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

  const currentMusic = musics[currentMusicIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleEnded = () => {
      if (currentMusicIndex < musics.length - 1) {
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
  }, [currentMusicIndex, isPlaying, musics.length])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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
    if (currentMusicIndex < musics.length - 1) {
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

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (musics.length === 0) {
    return (
      <div className="portfolio-player">
        <i className="fas fa-music"></i>
        <h3>Portfólio Musical</h3>
        <p>Adicione suas primeiras músicas para criar um portfólio incrível!</p>
        <p className="text-sm opacity-75">
          Use o botão "Adicionar Música" acima para fazer upload de suas produções musicais.
        </p>
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
          disabled={currentMusicIndex === musics.length - 1}
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

      {/* Playlist */}
      {musics.length > 1 && (
        <div className="player-playlist">
          <h4>Playlist ({musics.length} músicas)</h4>
          <div className="playlist-items">
            {musics.map((music, index) => (
              <div
                key={music.id}
                className={`playlist-item ${index === currentMusicIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentMusicIndex(index)
                  setIsPlaying(true)
                }}
              >
                {music.coverUrl ? (
                  <div className="playlist-cover-thumb">
                    <img src={music.coverUrl} alt={`Capa de ${music.title}`} />
                  </div>
                ) : (
                  <span className="playlist-number">{index + 1}</span>
                )}
                <div className="playlist-info">
                  <div className="playlist-title">{music.title}</div>
                  <div className="playlist-artist">{music.artist}</div>
                </div>
                {index === currentMusicIndex && isPlaying && (
                  <i className="fas fa-volume-up playlist-playing"></i>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
