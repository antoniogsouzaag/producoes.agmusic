
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, telefone, servico, mensagem, tipo } = body

    // Validar dados obrigatórios
    if (!nome || !email || !servico || !mensagem) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    // Segurança: validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Segurança: limitar tamanho dos campos
    if (nome.length > 200 || email.length > 200 || mensagem.length > 5000) {
      return NextResponse.json(
        { error: 'Dados excedem tamanho máximo permitido' },
        { status: 400 }
      )
    }

    // Criar o conteúdo do email
    const assunto = tipo === 'estudio' 
      ? `[Estúdio AG Music] Nova solicitação: ${servico}`
      : `[AG Music] Nova mensagem de contato: ${servico}`

    const emailBody = `
Nova solicitação recebida pelo site:

Nome: ${nome}
Email: ${email}
Telefone: ${telefone || 'Não informado'}
Serviço: ${servico}

Mensagem:
${mensagem}

---
Enviado pelo formulário de contato do site AG Music
Data: ${new Date().toLocaleString('pt-BR')}
    `.trim()

    // Criar o link mailto com os dados preenchidos
    const mailtoLink = `mailto:agmusicproducoes@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(emailBody)}`

    console.log('Contato recebido:', {
      nome,
      email,
      telefone,
      servico,
      mensagem: mensagem.substring(0, 100) + '...'
    })

    // Como não temos configuração de email server, vamos retornar sucesso
    // e mostrar instruções para configurar email ou usar WhatsApp como fallback
    
    return NextResponse.json({
      success: true,
      message: 'Mensagem recebida com sucesso!',
      mailtoLink, // Pode ser usado pelo frontend se necessário
      whatsappLink: `https://wa.me/5564993049853?text=${encodeURIComponent(`
Olá! Gostaria de informações sobre:

*Nome:* ${nome}
*Email:* ${email}
*Telefone:* ${telefone || 'Não informado'}
*Serviço:* ${servico}
*Mensagem:* ${mensagem}
      `.trim())}`
    })

  } catch (error) {
    console.error('Erro ao processar contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
