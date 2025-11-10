import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do transportador SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outros
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Função para gerar HTML do email
const generateEmailHTML = (userData, consultaData, nomeClinica) => {
  const { especialidade, medico, data, hora } = consultaData;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Consulta - ${nomeClinica}</title>
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
    <div class="header">
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
      <h1>Consulta Confirmada!</h1>
      <p>${nomeClinica} - Sistema Inteligente de Triagem</p>
    </div>

    <div class="content">
      <div class="greeting">
        Olá, <strong>${userData.name}</strong>! 👋
      </div>

      <div class="message">
        Sua consulta na <strong>${nomeClinica}</strong> foi <strong>agendada com sucesso</strong>! Estamos felizes em atendê-lo(a). 
        Abaixo estão os detalhes da sua consulta:
      </div>

      <div class="consulta-card">
        <div class="consulta-title">📋 Detalhes da Consulta</div>
        <div class="consulta-info">
          
          <div class="info-row">
            <div class="info-icon">👤</div>
            <div class="info-content">
              <div class="info-label">Paciente</div>
              <div class="info-value">${userData.name}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">🏥</div>
            <div class="info-content">
              <div class="info-label">Especialidade</div>
              <div class="info-value">${especialidade}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">👨‍⚕️</div>
            <div class="info-content">
              <div class="info-label">Médico(a)</div>
              <div class="info-value">${medico || 'A definir'}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <div class="info-label">Data</div>
              <div class="info-value">${new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">🕐</div>
            <div class="info-content">
              <div class="info-label">Horário</div>
              <div class="info-value">${hora}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">📍</div>
            <div class="info-content">
              <div class="info-label">Local</div>
              <div class="info-value">${nomeClinica}</div>
            </div>
          </div>

        </div>
      </div>

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

      <div class="message" style="margin-top: 30px; font-size: 14px;">
        Caso precise alterar ou cancelar sua consulta, acesse o sistema ou entre em contato conosco.
      </div>
    </div>

    <div class="footer">
      <p class="footer-text"><strong>${nomeClinica} - Sistema Inteligente de Triagem</strong></p>
      <p class="footer-text">📧 contato@medicenter.com.br | 📱 (11) 99999-9999</p>
      <p class="footer-text">📍 Av. Paulista, 1000 - São Paulo, SP</p>
      
      <p class="footer-text" style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        Este é um email automático. Por favor, não responda.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Rota para enviar email de confirmação de consulta
app.post('/api/send-email', async (req, res) => {
  try {
    const { userData, consultaData, nomeClinica } = req.body;

    // Validação básica
    if (!userData || !userData.email || !consultaData) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para envio de email'
      });
    }

    console.log('📧 Preparando envio de email...');
    console.log('📧 Destinatário:', userData.email);
    console.log('📧 Dados da consulta:', consultaData);

    // Cria transportador
    const transporter = createTransporter();

    // Verifica conexão SMTP
    await transporter.verify();
    console.log('✅ Servidor SMTP conectado');

    // Gera HTML do email
    const htmlContent = generateEmailHTML(
      userData, 
      consultaData, 
      nomeClinica || process.env.CLINIC_NAME || 'MediCenter'
    );

    // Configurações do email
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'MediCenter',
        address: process.env.SMTP_USER
      },
      to: userData.email,
      subject: `✅ Consulta Confirmada - ${consultaData.especialidade}`,
      html: htmlContent,
      text: `
Olá, ${userData.name}!

Sua consulta foi agendada com sucesso!

Detalhes da Consulta:
- Paciente: ${userData.name}
- Especialidade: ${consultaData.especialidade}
- Data: ${new Date(consultaData.data + 'T00:00:00').toLocaleDateString('pt-BR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
- Horário: ${consultaData.hora}
- Local: ${nomeClinica || 'MediCenter'}

Importante:
• Chegue com 15 minutos de antecedência
• Traga documento de identidade e carteirinha do convênio
• Em caso de impossibilidade, cancele com 24h de antecedência

${nomeClinica || 'MediCenter'} - Sistema Inteligente de Triagem
      `
    };

    // Envia o email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email enviado com sucesso!');
    console.log('📬 Message ID:', info.messageId);

    res.json({
      success: true,
      message: 'Email enviado com sucesso',
      messageId: info.messageId,
      recipient: userData.email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de email funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de email rodando na porta ${PORT}`);
  console.log(`📧 SMTP configurado: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  console.log(`✉️  Remetente: ${process.env.SMTP_USER}`);
});
