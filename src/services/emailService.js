// Serviço de envio de emails

/**
 * Simula envio de email de confirmação de consulta
 * Em produção, integrar com serviço real como SendGrid, AWS SES, etc.
 */
export async function sendConsultaConfirmationEmail(userData, consultaData) {
  console.log('📧 Preparando envio de email...');
  console.log('📧 Destinatário:', userData.email);
  console.log('📧 Dados da consulta:', consultaData);

  // Simula delay de envio de email
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simula 95% de sucesso
      const success = Math.random() > 0.05;

      if (success) {
        console.log('✅ Email enviado com sucesso para:', userData.email);
        resolve({
          success: true,
          messageId: `msg_${Date.now()}`,
          recipient: userData.email,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('❌ Falha ao enviar email');
        reject(new Error('Falha ao enviar email'));
      }
    }, 1500);
  });
}

/**
 * Gera HTML do email de confirmação
 */
export function generateEmailHTML(userData, consultaData) {
  const { especialidade, medico, data, hora } = consultaData;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Consulta - SITPM</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      width: 60px;
      height: 60px;
      background-color: white;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 10px 0 0 0;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #1f2937;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .consulta-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 24px;
      margin: 30px 0;
    }
    .consulta-title {
      font-size: 14px;
      font-weight: 600;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .consulta-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .info-icon {
      width: 40px;
      height: 40px;
      background-color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .info-content {
      flex: 1;
    }
    .info-label {
      font-size: 12px;
      color: #059669;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .info-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
    }
    .instructions {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .instructions-title {
      font-size: 14px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .instructions-text {
      font-size: 14px;
      color: #78350f;
      line-height: 1.5;
      margin: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin: 5px 0;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-link {
      display: inline-block;
      margin: 0 10px;
      color: #10b981;
      text-decoration: none;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 20px;
      }
      .header {
        padding: 30px 20px;
      }
      .content {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
      <h1>Consulta Confirmada!</h1>
      <p>SITPM - Sistema Inteligente de Triagem</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">
        Olá, <strong>${userData.name}</strong>! 👋
      </div>

      <div class="message">
        Sua consulta foi <strong>agendada com sucesso</strong>! Estamos felizes em atendê-lo(a). 
        Abaixo estão os detalhes da sua consulta:
      </div>

      <!-- Consulta Card -->
      <div class="consulta-card">
        <div class="consulta-title">📋 Detalhes da Consulta</div>
        <div class="consulta-info">
          
          <div class="info-row">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Especialidade</div>
              <div class="info-value">${especialidade}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17 11 19 13 23 9"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Médico(a)</div>
              <div class="info-value">${medico}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Data</div>
              <div class="info-value">${new Date(data).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="info-content">
              <div class="info-label">Horário</div>
              <div class="info-value">${hora}</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <div class="instructions-title">
          <span>⚠️</span>
          <span>Importante</span>
        </div>
        <p class="instructions-text">
          • Chegue com <strong>15 minutos de antecedência</strong><br>
          • Traga documento de identidade e carteirinha do convênio<br>
          • Em caso de impossibilidade, cancele com 24h de antecedência<br>
          • Se tiver sintomas de gripe/resfriado, entre em contato conosco
        </p>
      </div>

      <center>
        <a href="#" class="cta-button">Visualizar no Sistema</a>
      </center>

      <div class="message" style="margin-top: 30px; font-size: 14px;">
        Caso precise alterar ou cancelar sua consulta, acesse o sistema ou entre em contato conosco.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text"><strong>SITPM - Sistema Inteligente de Triagem</strong></p>
      <p class="footer-text">📧 contato@sitpm.com.br | 📱 (11) 99999-9999</p>
      <p class="footer-text">📍 Av. Paulista, 1000 - São Paulo, SP</p>
      
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Facebook</a>
        <a href="#" class="social-link">LinkedIn</a>
      </div>
      
      <p class="footer-text" style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        Este é um email automático. Por favor, não responda.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envia email de confirmação de consulta agendada
 */
export async function enviarEmailConsultaAgendada(userData, consultaData, nomeClinica = 'MediCenter') {
  try {
    console.log('📧 Iniciando envio de email real...');
    console.log('📧 Destinatário:', userData.email);
    console.log('📧 Dados da consulta:', consultaData);

    // Faz chamada real ao servidor backend
    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData,
        consultaData,
        nomeClinica
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Email enviado com sucesso!');
      console.log('📬 Message ID:', result.messageId);
      console.log('📧 Enviado para:', result.recipient);
      
      return {
        success: true,
        message: `Email enviado para ${userData.email}`,
        ...result
      };
    } else {
      throw new Error(result.message || 'Erro ao enviar email');
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return {
      success: false,
      message: 'Não foi possível enviar o email de confirmação',
      error: error.message
    };
  }
}

/**
 * Envia email de cancelamento de consulta
 */
export async function enviarEmailConsultaCancelada(userData, consultaData) {
  console.log('📧 Enviando email de cancelamento...');
  
  // Simula envio
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Email de cancelamento enviado para ${userData.email}`
      });
    }, 1000);
  });
}

/**
 * Envia email de lembrete de consulta (24h antes)
 */
export async function enviarEmailLembreteConsulta(userData, consultaData) {
  console.log('📧 Enviando lembrete de consulta...');
  
  // Simula envio
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Lembrete enviado para ${userData.email}`
      });
    }, 1000);
  });
}
