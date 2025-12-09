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

// Rota para enviar lembretes de consulta
app.post('/api/send-reminder', async (req, res) => {
  try {
    const { paciente, medico, especialidade, dataHora, tempoRestante, frequencia, nomeClinica, linkSalaOnline } = req.body;

    // Validação básica
    if (!paciente || !paciente.email || !medico || !dataHora) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para envio de lembrete'
      });
    }

    console.log('📬 Preparando envio de lembrete...');
    console.log('📬 Destinatário:', paciente.email);
    console.log('📬 Médico:', medico);

    // Cria transportador
    const transporter = createTransporter();

    // Verifica conexão SMTP
    await transporter.verify();
    console.log('✅ Servidor SMTP conectado para lembrete');

    // Determina cor da urgência
    let corUrgencia = '#4FACFE'; // azul normal
    let textoUrgencia = 'Consulta Agendada';
    
    if (tempoRestante && tempoRestante.totalMinutos <= 180) {
      corUrgencia = '#FF9500'; // laranja < 3h
      textoUrgencia = '⚠️ CONSULTA EM BREVE!';
    }
    if (tempoRestante && tempoRestante.totalMinutos <= 60) {
      corUrgencia = '#EF4444'; // vermelho < 1h
      textoUrgencia = '🚨 CONSULTA MUITO EM BREVE!';
    }

    // Gera HTML do email de lembrete
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembrete de Consulta</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, ${corUrgencia} 0%, #00F2FE 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 16px;
      color: #333;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .info-box {
      background: #f0f9ff;
      border-left: 4px solid ${corUrgencia};
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e0e7ff;
      font-size: 15px;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #666;
      font-weight: 600;
    }
    .info-value {
      color: #333;
      font-weight: 700;
    }
    .countdown {
      background: linear-gradient(135deg, #FEF08A 0%, #FCD34D 100%);
      border: 2px solid #FBBF24;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .countdown-title {
      font-size: 12px;
      color: #92400E;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .countdown-text {
      font-size: 24px;
      font-weight: 700;
      color: #B45309;
    }
    .documents {
      background: #FFFBEB;
      border: 2px solid #FCD34D;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .documents-title {
      font-size: 14px;
      font-weight: 700;
      color: #92400E;
      margin-bottom: 12px;
    }
    .documents-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .documents-list li {
      padding: 8px 0;
      font-size: 14px;
      color: #78350F;
    }
    .documents-list li:before {
      content: "✅ ";
      margin-right: 8px;
      font-weight: 700;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      margin: 20px auto;
      text-align: center;
      width: 200px;
    }
    .footer {
      background: #f8fafc;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${textoUrgencia}</h1>
      <p>Você tem uma consulta agendada</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Olá <strong>${paciente.name || 'Paciente'}</strong>,
        <br><br>
        Este é um lembrete automático de sua consulta agendada. Verifique os detalhes abaixo:
      </div>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">👨‍⚕️ MÉDICO:</span>
          <span class="info-value">${medico}</span>
        </div>
        <div class="info-row">
          <span class="info-label">🏥 ESPECIALIDADE:</span>
          <span class="info-value">${especialidade}</span>
        </div>
        <div class="info-row">
          <span class="info-label">📅 DATA:</span>
          <span class="info-value">${new Date(dataHora).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">⏰ HORÁRIO:</span>
          <span class="info-value">${new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        ${linkSalaOnline ? `
        <div class="info-row" style="background: #DBEAFE; margin-top: 10px; padding: 15px; border-radius: 8px;">
          <span class="info-label">💻 LINK DA SALA VIRTUAL:</span>
          <span class="info-value"><a href="${linkSalaOnline}" style="color: #2563EB; font-weight: 700; text-decoration: none;">Clique aqui para entrar</a></span>
        </div>
        ` : ''}
      </div>

      ${tempoRestante && tempoRestante.texto ? `
      <div class="countdown">
        <div class="countdown-title">⏱️ FALTA PARA SUA CONSULTA</div>
        <div class="countdown-text">${tempoRestante.texto}</div>
      </div>
      ` : ''}

      <div class="documents">
        <div class="documents-title">📋 Documentos Necessários</div>
        <ul class="documents-list">
          <li>Documento de identidade (RG ou CNH)</li>
          <li>Cartão do convênio (se aplicável)</li>
          <li>Pedido médico ou exames anteriores</li>
          <li>Lista de medicamentos em uso</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <p style="font-size: 13px; color: #666;">
          ⏰ Chegue com <strong>15 minutos de antecedência</strong>
        </p>
      </div>
    </div>

    <div class="footer">
      <p><strong>${nomeClinica || 'MediCenter'}</strong> - Sistema Inteligente de Triagem</p>
      <p>Este é um email automático. Não responda diretamente.</p>
      <p>Enviado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Configurações do email
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'MediCenter - Lembretes',
        address: process.env.SMTP_USER
      },
      to: paciente.email,
      subject: `⏰ Lembrete: Consulta com ${medico} em ${new Date(dataHora).toLocaleDateString('pt-BR')}`,
      html: htmlContent,
      text: `
LEMBRETE DE CONSULTA

Olá ${paciente.name},

Você tem uma consulta agendada:

Médico: ${medico}
Especialidade: ${especialidade}
Data: ${new Date(dataHora).toLocaleDateString('pt-BR')}
Horário: ${new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}

Documentos necessários:
✅ Documento de identidade (RG ou CNH)
✅ Cartão do convênio (se aplicável)
✅ Pedido médico ou exames anteriores
✅ Lista de medicamentos em uso

Chegue com 15 minutos de antecedência.

${nomeClinica || 'MediCenter'} - Sistema Inteligente de Triagem
      `
    };

    // Envia o email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Lembrete enviado com sucesso!');
    console.log('📬 Message ID:', info.messageId);

    res.json({
      success: true,
      message: 'Lembrete enviado com sucesso',
      messageId: info.messageId,
      recipient: paciente.email,
      medico: medico,
      dataHora: dataHora,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao enviar lembrete:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar lembrete',
      error: error.message
    });
  }
});

// Rota para enviar email de cancelamento de consulta
app.post('/api/send-cancellation', async (req, res) => {
  try {
    const { paciente, medico, especialidade, dataHora, motivo, nomeClinica } = req.body;

    if (!paciente || !paciente.email || !medico || !dataHora) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para envio de email de cancelamento'
      });
    }

    console.log('📧 Preparando email de cancelamento...');
    console.log('📧 Destinatário:', paciente.email);

    const transporter = createTransporter();
    await transporter.verify();

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cancelamento de Consulta</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 40px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px; }
    .info-box { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #FECACA; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #666; font-weight: 600; }
    .info-value { color: #333; font-weight: 700; }
    .alert-box { background: #FEF2F2; border: 2px solid #FCA5A5; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .alert-title { font-size: 14px; font-weight: 700; color: #DC2626; margin-bottom: 10px; }
    .alert-text { font-size: 14px; color: #991B1B; line-height: 1.6; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; margin: 20px 0; text-align: center; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Consulta Cancelada</h1>
    </div>
    
    <div class="content">
      <div style="font-size: 16px; color: #333; margin-bottom: 20px;">
        Olá <strong>${paciente.name || 'Paciente'}</strong>,
        <br><br>
        Sua consulta foi <strong>cancelada com sucesso</strong>. Abaixo estão os detalhes:
      </div>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">👨‍⚕️ MÉDICO:</span>
          <span class="info-value">${medico}</span>
        </div>
        <div class="info-row">
          <span class="info-label">🏥 ESPECIALIDADE:</span>
          <span class="info-value">${especialidade}</span>
        </div>
        <div class="info-row">
          <span class="info-label">📅 DATA:</span>
          <span class="info-value">${new Date(dataHora).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">⏰ HORÁRIO:</span>
          <span class="info-value">${new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div class="alert-box">
        <div class="alert-title">📌 Motivo do Cancelamento:</div>
        <div class="alert-text">${motivo || 'Cancelado pelo paciente'}</div>
      </div>

      <div style="background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #1E40AF; font-weight: 600; margin-bottom: 10px;">💡 Próximos passos:</p>
        <ul style="margin: 0; padding-left: 20px; color: #1E40AF;">
          <li>Você pode agendar uma nova consulta a qualquer momento no sistema</li>
          <li>Se precisar de suporte, entre em contato conosco</li>
          <li>Seus dados e histórico permanecem salvos</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>${nomeClinica || 'MediCenter'}</strong> - Sistema Inteligente de Triagem</p>
      <p>Este é um email automático. Não responda diretamente.</p>
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'MediCenter',
        address: process.env.SMTP_USER
      },
      to: paciente.email,
      subject: `❌ Consulta Cancelada - ${especialidade}`,
      html: htmlContent,
      text: `
CONSULTA CANCELADA

Olá ${paciente.name},

Sua consulta foi cancelada.

Detalhes:
- Médico: ${medico}
- Especialidade: ${especialidade}
- Data: ${new Date(dataHora).toLocaleDateString('pt-BR')}
- Horário: ${new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
- Motivo: ${motivo || 'Cancelado pelo paciente'}

${nomeClinica || 'MediCenter'} - Sistema Inteligente de Triagem
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email de cancelamento enviado com sucesso!');

    res.json({
      success: true,
      message: 'Email de cancelamento enviado com sucesso',
      messageId: info.messageId,
      recipient: paciente.email
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email de cancelamento:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email de cancelamento',
      error: error.message
    });
  }
});

// Rota para enviar email de modificação de consulta
app.post('/api/send-modification', async (req, res) => {
  try {
    const { paciente, medico, especialidade, dataHoraAnterior, dataHoraNovaç, novaData, novoHorario, nomeClinica } = req.body;

    if (!paciente || !paciente.email || !medico) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para envio de email de modificação'
      });
    }

    console.log('📧 Preparando email de modificação...');
    console.log('📧 Destinatário:', paciente.email);

    const transporter = createTransporter();
    await transporter.verify();

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modificação de Consulta</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 40px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 40px; }
    .comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .comparison-box { background: #F0F9FF; border: 2px solid #3B82F6; border-radius: 8px; padding: 15px; }
    .comparison-title { font-size: 12px; font-weight: 700; color: #1E40AF; text-transform: uppercase; margin-bottom: 10px; }
    .comparison-content { font-size: 14px; color: #333; }
    .arrow { text-align: center; padding: 20px 0; font-size: 24px; color: #3B82F6; }
    .info-box { background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 Consulta Modificada</h1>
    </div>
    
    <div class="content">
      <div style="font-size: 16px; color: #333; margin-bottom: 20px;">
        Olá <strong>${paciente.name || 'Paciente'}</strong>,
        <br><br>
        Sua consulta foi <strong>modificada com sucesso</strong>. Confira os novos detalhes:
      </div>

      <div class="comparison">
        <div class="comparison-box">
          <div class="comparison-title">❌ Data Anterior</div>
          <div class="comparison-content">
            <strong>${new Date(dataHoraAnterior).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</strong><br>
            ${new Date(dataHoraAnterior).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div class="comparison-box">
          <div class="comparison-title">✅ Nova Data</div>
          <div class="comparison-content">
            <strong>${novaData}</strong><br>
            ${novoHorario}
          </div>
        </div>
      </div>

      <div class="info-box">
        <div style="margin-bottom: 10px;">
          <p style="margin: 0; font-weight: 600; color: #1E40AF;">👨‍⚕️ Médico:</p>
          <p style="margin: 5px 0 0 0; color: #333;">${medico}</p>
        </div>
        <div>
          <p style="margin: 10px 0 0 0; font-weight: 600; color: #1E40AF;">🏥 Especialidade:</p>
          <p style="margin: 5px 0 0 0; color: #333;">${especialidade}</p>
        </div>
      </div>

      <div style="background: #F0F9FF; border: 2px solid #3B82F6; border-radius: 8px; padding: 15px; text-align: center;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600;">📌 Lembre-se:</p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1E40AF; text-align: left;">
          <li>Chegue 15 minutos antes do horário</li>
          <li>Leve seu documento e cartão de convênio</li>
          <li>Cancele com 24h de antecedência se necessário</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>${nomeClinica || 'MediCenter'}</strong> - Sistema Inteligente de Triagem</p>
      <p>Este é um email automático. Não responda diretamente.</p>
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'MediCenter',
        address: process.env.SMTP_USER
      },
      to: paciente.email,
      subject: `📝 Consulta Modificada - Nova data: ${novaData} às ${novoHorario}`,
      html: htmlContent,
      text: `
CONSULTA MODIFICADA

Olá ${paciente.name},

Sua consulta foi modificada com sucesso!

Detalhes Anteriores:
- Data: ${new Date(dataHoraAnterior).toLocaleDateString('pt-BR')}
- Horário: ${new Date(dataHoraAnterior).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}

Novos Detalhes:
- Médico: ${medico}
- Especialidade: ${especialidade}
- Data: ${novaData}
- Horário: ${novoHorario}

${nomeClinica || 'MediCenter'} - Sistema Inteligente de Triagem
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email de modificação enviado com sucesso!');

    res.json({
      success: true,
      message: 'Email de modificação enviado com sucesso',
      messageId: info.messageId,
      recipient: paciente.email
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email de modificação:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email de modificação',
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
