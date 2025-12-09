// Serviço de Lembretes Automáticos de Consultas

/**
 * Calcula o tempo restante até a consulta
 */
export function calcularTempoRestante(dataHoraConsulta) {
  const agora = new Date();
  const consulta = new Date(dataHoraConsulta);
  const diff = consulta - agora;

  if (diff <= 0) {
    return {
      passado: true,
      horas: 0,
      minutos: 0,
      totalMinutos: 0,
      texto: 'Consulta já passou'
    };
  }

  const horas = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const totalMinutos = Math.floor(diff / (1000 * 60));

  let texto = '';
  if (horas > 24) {
    const dias = Math.floor(horas / 24);
    const horasRestantes = horas % 24;
    texto = `${dias} dia${dias > 1 ? 's' : ''} e ${horasRestantes}h`;
  } else if (horas > 0) {
    texto = `${horas}h ${minutos}min`;
  } else {
    texto = `${minutos} minutos`;
  }

  return {
    passado: false,
    horas,
    minutos,
    totalMinutos,
    texto,
    diasRestantes: Math.floor(horas / 24)
  };
}

/**
 * Verifica se deve enviar lembrete baseado na frequência configurada
 */
export function deveEnviarLembrete(ultimoLembrete, frequenciaMinutos) {
  if (!ultimoLembrete) return true;

  const agora = new Date();
  const ultimo = new Date(ultimoLembrete);
  const diffMinutos = Math.floor((agora - ultimo) / (1000 * 60));

  return diffMinutos >= frequenciaMinutos;
}

/**
 * Agenda lembretes automáticos para uma consulta
 */
export function agendarLembretes(consulta, configuracao = {}) {
  const {
    frequenciaMinutos = 30, // Padrão: a cada 30 minutos
    antecedenciaHoras = 24, // Começar a lembrar 24h antes
    lembreteUrgente = 60, // Lembrete urgente quando faltar 1h
  } = configuracao;

  const tempoRestante = calcularTempoRestante(consulta.dataHora);
  
  if (tempoRestante.passado) {
    return [];
  }

  const lembretes = [];
  const agora = new Date();
  const consulaData = new Date(consulta.dataHora);

  // Calcula quando começar a enviar lembretes
  const inicioLembretes = new Date(consulaData.getTime() - (antecedenciaHoras * 60 * 60 * 1000));

  // Se ainda não chegou a hora de começar
  if (agora < inicioLembretes) {
    lembretes.push({
      tipo: 'programado',
      dataEnvio: inicioLembretes,
      mensagem: 'Primeiro lembrete será enviado quando faltar 24h'
    });
    return lembretes;
  }

  // Calcula quantos lembretes enviar até a consulta
  const minutosRestantes = tempoRestante.totalMinutos;
  const quantidadeLembretes = Math.floor(minutosRestantes / frequenciaMinutos);

  for (let i = 0; i <= quantidadeLembretes; i++) {
    const minutosAteEnvio = i * frequenciaMinutos;
    const dataEnvio = new Date(agora.getTime() + (minutosAteEnvio * 60 * 1000));

    // Não agendar lembretes depois da consulta
    if (dataEnvio >= consulaData) break;

    const tempoAteConsulta = calcularTempoRestante(consulaData);
    const urgente = tempoAteConsulta.totalMinutos <= lembreteUrgente;

    lembretes.push({
      tipo: urgente ? 'urgente' : 'normal',
      dataEnvio,
      minutosRestantes: Math.floor((consulaData - dataEnvio) / (1000 * 60)),
      urgente
    });
  }

  return lembretes;
}

/**
 * Formata email de lembrete com contador
 */
export function gerarEmailLembrete(consulta, tempoRestante, configuracaoLembrete = {}) {
  const { nome, email } = consulta.paciente || { nome: 'Paciente', email: '' };
  const { medico, especialidade, dataHora, tipo, local } = consulta;
  // Fallback para Google Meet quando não houver link específico salvo
  const linkSalaOnline = consulta.linkSalaOnline || consulta.link || consulta.urlSala || 'https://meet.google.com/tqf-txzf-pwb';

  const dataFormatada = new Date(dataHora).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  const horaFormatada = new Date(dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Define o tom do email baseado no tempo restante
  let corTema = '#3B82F6'; // Azul padrão
  let mensagemUrgencia = '';
  let iconeUrgencia = '📅';

  if (tempoRestante.totalMinutos <= 60) {
    corTema = '#EF4444'; // Vermelho - urgente
    mensagemUrgencia = '⚠️ URGENTE: Sua consulta é HOJE em menos de 1 hora!';
    iconeUrgencia = '🚨';
  } else if (tempoRestante.totalMinutos <= 180) {
    corTema = '#F59E0B'; // Laranja - alerta
    mensagemUrgencia = '⏰ ATENÇÃO: Sua consulta é HOJE em poucas horas!';
    iconeUrgencia = '⏰';
  } else if (tempoRestante.horas <= 24) {
    mensagemUrgencia = '📢 Lembrete: Sua consulta é amanhã!';
    iconeUrgencia = '📢';
  } else {
    mensagemUrgencia = '📌 Lembrete da sua consulta';
  }

  const documentosNecessarios = [
    'Documento de identidade (RG ou CNH)',
    'Cartão do convênio (se aplicável)',
    'Pedido médico ou exames anteriores',
    'Lista de medicamentos em uso',
  ];

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembrete de Consulta - SITPM</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, ${corTema} 0%, ${adjustColor(corTema, -20)} 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .urgency-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .countdown {
      background: rgba(255, 255, 255, 0.95);
      color: ${corTema};
      padding: 30px;
      border-radius: 16px;
      margin: 30px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    .countdown-number {
      font-size: 48px;
      font-weight: 800;
      line-height: 1;
      margin: 10px 0;
      color: ${corTema};
    }
    .countdown-label {
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .info-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid ${corTema};
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      align-items: center;
      margin: 12px 0;
      gap: 12px;
    }
    .info-icon {
      width: 40px;
      height: 40px;
      background: ${corTema};
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .info-text {
      flex: 1;
    }
    .info-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 16px;
      color: #111827;
      font-weight: 600;
      margin-top: 2px;
    }
    .documents-section {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }
    .documents-title {
      font-size: 16px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .documents-list {
      list-style: none;
      padding: 0;
    }
    .documents-list li {
      padding: 10px 0;
      color: #78350f;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .documents-list li:before {
      content: "✓";
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #f59e0b;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, ${corTema} 0%, ${adjustColor(corTema, -20)} 100%);
      color: white;
      padding: 16px 40px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.6;
    }
    .alert-box {
      background: #fee2e2;
      border: 2px solid #ef4444;
      padding: 16px;
      border-radius: 12px;
      margin: 20px 0;
      color: #991b1b;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="urgency-badge">
        ${iconeUrgencia} ${mensagemUrgencia}
      </div>
      <h1 style="font-size: 32px; margin: 20px 0 10px 0;">Lembrete de Consulta</h1>
      <p style="font-size: 16px; opacity: 0.9;">Sistema Integrado de Triagem e Pré-Atendimento Médico</p>
    </div>

    <!-- Countdown -->
    <div class="countdown">
      <div class="countdown-label">Falta${tempoRestante.horas > 0 || tempoRestante.minutos !== 1 ? 'm' : ''}</div>
      <div class="countdown-number">${tempoRestante.texto}</div>
      <div class="countdown-label">Para sua consulta</div>
    </div>

    <!-- Content -->
    <div class="content">
      <p style="font-size: 18px; color: #111827; margin-bottom: 20px;">
        Olá, <strong>${nome}</strong>! 👋
      </p>
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
        Este é um lembrete automático da sua consulta agendada. Não se atrase! ⏰
      </p>

      <!-- Consulta Info -->
      <div class="info-card">
        <div class="info-row">
          <div class="info-icon">📅</div>
          <div class="info-text">
            <div class="info-label">Data</div>
            <div class="info-value">${dataFormatada}</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-icon">⏰</div>
          <div class="info-text">
            <div class="info-label">Horário</div>
            <div class="info-value">${horaFormatada}</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-icon">👨‍⚕️</div>
          <div class="info-text">
            <div class="info-label">Médico</div>
            <div class="info-value">${medico}</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-icon">🏥</div>
          <div class="info-text">
            <div class="info-label">Especialidade</div>
            <div class="info-value">${especialidade}</div>
          </div>
        </div>

        ${tipo === 'presencial' ? `
        <div class="info-row">
          <div class="info-icon">📍</div>
          <div class="info-text">
            <div class="info-label">Local</div>
            <div class="info-value">${local || 'Clínica Principal'}</div>
          </div>
        </div>
        ` : `
        <div class="info-row">
          <div class="info-icon">💻</div>
          <div class="info-text">
            <div class="info-label">Tipo</div>
            <div class="info-value">Consulta Online (Telemedicina)</div>
          </div>
        </div>
        <div class="info-row">
          <div class="info-icon">🔗</div>
          <div class="info-text">
            <div class="info-label">Sala Virtual</div>
            <div class="info-value"><a href="${linkSalaOnline}" style="color: ${corTema}; font-weight: 700; text-decoration: none;">Entrar na sala</a></div>
          </div>
        </div>
        `}
      </div>

      <!-- Alerta de urgência -->
      ${tempoRestante.totalMinutos <= 60 ? `
      <div class="alert-box">
        🚨 ATENÇÃO: Sua consulta é em MENOS DE 1 HORA! Prepare-se e não se atrase!
      </div>
      ` : ''}

      <!-- Documentos Necessários -->
      <div class="documents-section">
        <div class="documents-title">
          📋 Documentos Necessários
        </div>
        <p style="font-size: 14px; color: #78350f; margin-bottom: 15px;">
          <strong>NÃO ESQUEÇA de levar os seguintes documentos:</strong>
        </p>
        <ul class="documents-list">
          ${documentosNecessarios.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        ${tipo === 'online' ? `
        <a href="${linkSalaOnline}" class="cta-button" style="display: inline-block; margin-bottom: 16px;">
          💻 Entrar na sala virtual
        </a>
        <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">
          Use esse link para entrar no horário combinado
        </p>
        ` : ''}
        <a href="${gerarLinkConfirmacao(consulta.id)}" class="cta-button">
          ✅ Confirmar Comparecimento
        </a>
        <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
          Clique para confirmar que irá comparecer à consulta
        </p>
      </div>

      <!-- Configurações de lembrete -->
      <div style="background: #f3f4f6; padding: 16px; border-radius: 12px; margin-top: 20px;">
        <p style="font-size: 13px; color: #6b7280; text-align: center;">
          ${configuracaoLembrete.frequenciaMinutos 
            ? `📬 Você receberá lembretes a cada ${configuracaoLembrete.frequenciaMinutos} minutos`
            : '📬 Você está recebendo lembretes automáticos'
          }
          <br>
          <a href="${gerarLinkConfiguracao(consulta.id)}" style="color: ${corTema}; text-decoration: none; font-weight: 600;">
            Alterar configurações de lembrete
          </a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        <strong>SITPM - Sistema Integrado de Triagem e Pré-Atendimento Médico</strong><br>
        Este é um email automático. Caso tenha dúvidas, entre em contato conosco.
      </p>
      <p class="footer-text" style="margin-top: 15px; font-size: 12px;">
        © ${new Date().getFullYear()} SITPM. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Ajusta cor para mais escura ou clara
 */
function adjustColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

/**
 * Gera link para confirmação de comparecimento
 */
function gerarLinkConfirmacao(consultaId) {
  // Em produção, deve apontar para sua URL real
  const baseUrl = window.location.origin || 'http://localhost:5173';
  return `${baseUrl}/confirmar-comparecimento/${consultaId}`;
}

/**
 * Gera link para configuração de lembretes
 */
function gerarLinkConfiguracao(consultaId) {
  const baseUrl = window.location.origin || 'http://localhost:5173';
  return `${baseUrl}/configurar-lembretes/${consultaId}`;
}

/**
 * Salva configuração de lembretes no localStorage
 */
export function salvarConfiguracaoLembrete(consultaId, configuracao) {
  const config = JSON.parse(localStorage.getItem('reminderConfig') || '{}');
  config[consultaId] = {
    ...configuracao,
    atualizadoEm: new Date().toISOString()
  };
  localStorage.setItem('reminderConfig', JSON.stringify(config));
  return config[consultaId];
}

/**
 * Obtém configuração de lembretes
 */
export function obterConfiguracaoLembrete(consultaId) {
  const config = JSON.parse(localStorage.getItem('reminderConfig') || '{}');
  return config[consultaId] || {
    frequenciaMinutos: 30,
    antecedenciaHoras: 24,
    lembreteUrgente: 60,
    habilitado: true
  };
}

/**
 * Confirma comparecimento do paciente
 */
export function confirmarComparecimento(consultaId) {
  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  const index = consultas.findIndex(c => c.id === consultaId);
  
  if (index !== -1) {
    consultas[index].status = 'confirmada';
    consultas[index].comparecimentoConfirmadoEm = new Date().toISOString();
    localStorage.setItem('consultas', JSON.stringify(consultas));
    return true;
  }
  
  return false;
}

/**
 * Marca consulta como atendida (concluída)
 */
export function marcarComoAtendida(consultaId) {
  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  const index = consultas.findIndex(c => c.id === consultaId);
  
  if (index !== -1) {
    consultas[index].status = 'concluida';
    consultas[index].atendidaEm = new Date().toISOString();
    localStorage.setItem('consultas', JSON.stringify(consultas));
    
    // Para os lembretes após marcar como atendida
    const config = obterConfiguracaoLembrete(consultaId);
    config.habilitado = false;
    salvarConfiguracaoLembrete(consultaId, config);
    
    return true;
  }
  
  return false;
}
