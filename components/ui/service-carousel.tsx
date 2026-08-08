'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

/**
 * Carousel de serviços, adaptado do bloco gallery4.
 *
 * Duas mudanças que o original exigia para funcionar aqui:
 *
 * 1. Cores. O gallery4 usa os tokens do shadcn (`bg-primary`,
 *    `text-muted-foreground`, `hsl(var(--primary))`). O tailwind.config deste
 *    projeto até mapeia esses nomes, mas as variáveis correspondentes nunca
 *    foram definidas no globals.css — `hsl(var(--primary))` sairia vazio e a
 *    cor simplesmente não pintaria. Aqui as cores vêm das variáveis da marca
 *    que existem de fato (--primary-color, --text-gray, --dark-bg).
 *
 * 2. `next/image` no lugar de <img>, que é o padrão do resto do site.
 */

export interface ServiceCarouselItem {
  id: string
  title: string
  description: string
  image: string
  /** Classe do ícone Font Awesome, como no resto do site. */
  icon: string
}

export interface ServiceCarouselProps {
  items: ServiceCarouselItem[]
}

export function ServiceCarousel({ items }: ServiceCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  /**
   * Remede o carousel quando a largura real dos slides aparece.
   *
   * O embla calcula os pontos de parada uma vez, ao montar. Se nesse instante
   * o slide ainda não tem os 320px que vêm do CSS, ele guarda tudo em zero: os
   * pontinhos até mudam de slide, mas a faixa nunca sai do lugar, porque o
   * destino de todo slide é a posição 0. Era exatamente o sintoma de arraste
   * morto — bastava redimensionar a janela para tudo voltar a funcionar.
   *
   * O ResizeObserver cobre a causa real (largura do slide mudando depois da
   * medição, seja por CSS, fonte ou imagem) sem depender de palpite de tempo.
   */
  useEffect(() => {
    if (!carouselApi || !trackRef.current) return

    const slide = trackRef.current.firstElementChild
    if (!slide) return

    let ultimaLargura = slide.getBoundingClientRect().width
    const observer = new ResizeObserver(() => {
      const largura = slide.getBoundingClientRect().width
      if (largura !== ultimaLargura) {
        ultimaLargura = largura
        carouselApi.reInit()
      }
    })
    observer.observe(slide)

    return () => observer.disconnect()
  }, [carouselApi])

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  return (
    <div className="service-carousel">
      <div className="service-carousel-nav">
        <button
          type="button"
          onClick={() => carouselApi?.scrollPrev()}
          disabled={!canScrollPrev}
          aria-label="Serviço anterior"
          className="service-carousel-arrow"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => carouselApi?.scrollNext()}
          disabled={!canScrollNext}
          aria-label="Próximo serviço"
          className="service-carousel-arrow"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>

      <Carousel
        setApi={setCarouselApi}
        opts={{
          breakpoints: {
            '(max-width: 768px)': { dragFree: true },
          },
        }}
      >
        <CarouselContent className="ml-0" ref={trackRef}>
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-auto pl-5"
            >
              <article className="service-slide">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 80vw, 360px"
                  className="service-slide-img"
                  draggable={false}
                />
                <div className="service-slide-veil" />
                {/* Fora do corpo do card: ancorado no topo, o ícone fica na
                    mesma altura em todos os slides, independente de quantas
                    linhas o texto ocupa lá embaixo. */}
                <span className="service-slide-icon">
                  <i className={item.icon} />
                </span>
                <div className="service-slide-body">
                  <h3 className="service-slide-title">{item.title}</h3>
                  <p className="service-slide-text">{item.description}</p>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="service-carousel-dots">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`service-carousel-dot ${currentSlide === index ? 'is-active' : ''}`}
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`Ir para ${item.title}`}
            aria-current={currentSlide === index}
          />
        ))}
      </div>
    </div>
  )
}
