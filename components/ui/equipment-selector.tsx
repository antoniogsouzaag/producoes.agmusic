'use client'

import { useEffect, useState } from 'react'

/**
 * Seletor de equipamentos — painéis que se abrem ao clicar.
 *
 * Adaptado do bloco interactive-selector. O que mudou e por quê:
 *
 * - **Sem react-icons.** O original importava cinco ícones de lá; o projeto já
 *   carrega Font Awesome no layout e usa essa família no site inteiro, então
 *   instalar outro pacote de ícones só para esta seção não se paga.
 * - **Ícone sem caixa**, pintado pelo gradiente da marca, igual aos cards de
 *   serviço.
 * - **Sem cabeçalho e sem `min-h-screen`.** O original trazia título, subtítulo
 *   e fundo próprios; aqui ele entra dentro de uma seção que já tem os seus.
 * - **`min-width: 600px` saiu.** Aquilo estourava a tela no celular. No mobile
 *   os painéis viram lista vertical.
 * - **Botão em vez de div clicável**, para funcionar no teclado.
 */

export interface EquipmentItem {
  id: string
  title: string
  description: string
  image: string
  /** Classe do ícone Font Awesome. */
  icon: string
}

export function EquipmentSelector({ items }: { items: EquipmentItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [revealed, setRevealed] = useState<number[]>([])

  // Entrada escalonada: os painéis aparecem um a um, da esquerda para a direita.
  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setRevealed((prev) => (prev.includes(i) ? prev : [...prev, i])), 140 * i)
    )
    return () => timers.forEach(clearTimeout)
  }, [items])

  return (
    <div className="equip-selector">
      {items.map((item, index) => {
        const isActive = activeIndex === index
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-expanded={isActive}
            className={`equip-panel ${isActive ? 'is-active' : ''} ${revealed.includes(index) ? 'is-revealed' : ''}`}
            style={{ backgroundImage: `url('${item.image}')` }}
          >
            <span className="equip-panel-veil" />
            <span className="equip-panel-label">
              <span className="equip-panel-icon">
                <i className={item.icon} />
              </span>
              <span className="equip-panel-info">
                <span className="equip-panel-title">{item.title}</span>
                <span className="equip-panel-desc">{item.description}</span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
