
'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou o assistente virtual da AG Music. Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // CORREÇÃO 2: Melhorar integração do chatbot com timeout e headers adicionais
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

      const response = await fetch('https://webhook.agmusic.cloud/webhook/botagmusic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'AG-Music-Website/1.0',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          message: text.trim(),
          timestamp: new Date().toISOString(),
          user_id: 'web_user_' + Date.now(),
          source: 'website',
          session_id: 'session_' + Date.now(),
          user_agent: navigator.userAgent || 'Unknown'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseText = await response.text()
      console.log('Raw response:', responseText)
      
      let data
      let botResponseText = ''
      
      try {
        data = JSON.parse(responseText)
        console.log('Parsed JSON data:', data)
      } catch (parseError) {
        console.log('Response is not JSON, using as plain text')
        // Se não for JSON válido, use a resposta como texto direto
        botResponseText = responseText.trim() || 'Resposta recebida com sucesso!'
      }
      
      // Se conseguiu parsear como JSON, extraia a mensagem
      if (data && !botResponseText) {
        if (typeof data === 'string') {
          botResponseText = data
        } else if (data.response) {
          botResponseText = data.response
        } else if (data.message) {
          botResponseText = data.message
        } else if (data.output) {
          botResponseText = data.output
        } else if (data.text) {
          botResponseText = data.text
        } else if (data.reply) {
          botResponseText = data.reply
        } else if (data.content) {
          botResponseText = data.content
        } else if (data.data && data.data.message) {
          botResponseText = data.data.message
        } else if (Array.isArray(data) && data.length > 0) {
          botResponseText = data[0].message || data[0].text || data[0].content || JSON.stringify(data[0])
        } else {
          // Se não encontrar um campo conhecido, use a primeira propriedade string
          const firstStringValue = Object.values(data).find(val => typeof val === 'string')
          botResponseText = firstStringValue as string || JSON.stringify(data) || 'Resposta recebida!'
        }
      }

      // Garantir que temos uma resposta válida
      if (!botResponseText || botResponseText.length === 0) {
        botResponseText = 'Recebi sua mensagem! Como posso ajudar mais?'
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      
    } catch (error) {
      console.error('Erro detalhado ao enviar mensagem:', error)
      
      let errorText = 'Desculpe, ocorreu um erro ao processar sua mensagem.'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorText = 'A conexão demorou muito para responder. Tente novamente.'
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorText = 'Problema de conexão. Verifique sua internet e tente novamente.'
        }
      }
      
      errorText += ' Por favor, entre em contato pelo WhatsApp: (64) 99304-9853'
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-button ${isOpen ? 'open' : ''}`}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-comments"></i>
        )}
      </button>

      {/* Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h3 className="chatbot-title">AG Music Bot</h3>
              <p className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="chatbot-close-btn"
            aria-label="Fechar chat"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chatbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="chatbot-input-form">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="chatbot-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Enviar mensagem"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </>
  )
}
