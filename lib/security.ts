import { NextRequest, NextResponse } from 'next/server'

// Rate limiting simples usando Map em memória
// Em produção, use Redis ou similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minuto
  MAX_REQUESTS: 100, // 100 requisições por minuto
}

export function rateLimit(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    })
    return true
  }
  
  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    return false
  }
  
  record.count++
  return true
}

// Limpar registros antigos a cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function sanitizeInput(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    .substring(0, maxLength)
    // Remove caracteres potencialmente perigosos
    .replace(/[<>]/g, '')
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 200
}
