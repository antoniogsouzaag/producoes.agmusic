'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
}

interface ImageGalleryModalProps {
  images: GalleryImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export default function ImageGalleryModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Reset loading state when image changes
  useEffect(() => {
    setIsLoading(true)
    setImageError(false)
  }, [currentIndex])

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
        break
      case 'ArrowRight':
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
        break
    }
  }, [isOpen, images.length, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <div 
      className="gallery-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de imagens"
    >
      {/* Close Button */}
      <button
        className="gallery-modal-close"
        onClick={onClose}
        aria-label="Fechar visualizador"
      >
        <i className="fas fa-times"></i>
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          className="gallery-modal-nav gallery-modal-prev"
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          aria-label="Imagem anterior"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      )}

      {/* Image Container */}
      <div 
        className="gallery-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="gallery-modal-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="gallery-modal-error">
            <i className="fas fa-image"></i>
            <p>Não foi possível carregar a imagem</p>
          </div>
        ) : (
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className={`gallery-modal-image ${isLoading ? 'loading' : 'loaded'}`}
            sizes="100vw"
            priority
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setImageError(true)
            }}
          />
        )}
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          className="gallery-modal-nav gallery-modal-next"
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          aria-label="Próxima imagem"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery-modal-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              aria-label={`Ver ${image.title || `imagem ${index + 1}`}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
