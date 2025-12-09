# 🔔 Sistema de Lembretes Automáticos de Consultas

## 📋 Visão Geral

O sistema de lembretes automáticos envia emails periódicos para os pacientes lembrando da consulta agendada, incluindo:
- ⏰ **Contador regressivo** mostrando quanto tempo falta
- 📋 **Lista de documentos** obrigatórios
- 🚨 **Alertas de urgência** quando a consulta está próxima
- ✅ **Confirmação de comparecimento** via email

## 🎯 Funcionalidades

### 1. Configuração Personalizada de Lembretes

Cada consulta pode ter sua própria configuração:

- **Frequência de envio**: 5, 15, 30 ou 60 minutos
- **Antecedência**: 1, 6, 12 ou 24 horas antes da consulta
- **Ativar/Desativar**: Liga ou desliga lembretes para consultas específicas

### 2. Contador Regressivo Inteligente

O email mostra dinamicamente quanto tempo falta:
- `2 dias e 5h` - Se faltarem mais de 24 horas
- `3h 45min` - Se faltar entre 1h e 24h
- `25 minutos` - Se faltar menos de 1 hora

### 3. Urgência Visual

O design do email muda conforme o tempo restante:

| Tempo Restante | Cor do Tema | Ícone | Mensagem |
|----------------|-------------|-------|----------|
| Mais de 3h | Azul | 📅 | "Lembrete da sua consulta" |
| Entre 1h-3h | Laranja | ⏰ | "ATENÇÃO: Sua consulta é HOJE" |
| Menos de 1h | Vermelho | 🚨 | "URGENTE: Consulta em menos de 1h" |

### 4. Documentos Obrigatórios

Todos os emails incluem a lista de documentos:
- ✓ Documento de identidade (RG ou CNH)
- ✓ Cartão do convênio (se aplicável)
- ✓ Pedido médico ou exames anteriores
- ✓ Lista de medicamentos em uso

### 5. Confirmação de Comparecimento

O paciente pode:
- **Confirmar** que irá comparecer (via link no email)
- **Marcar como atendida** após a consulta
- Ao marcar como atendida, **os lembretes param automaticamente**

## 🚀 Como Usar

### Configurar Lembretes para uma Consulta

1. Acesse **Minhas Consultas**
2. Clique no **ícone de sino (🔔)** na consulta desejada
3. Configure:
   - Ativar/Desativar lembretes
   - Frequência de envio (5, 15, 30 ou 60 min)
   - Quando começar (1, 6, 12 ou 24h antes)
4. Clique em **Salvar Configurações**

### Visualizar Email de Lembrete

1. Abra os **Detalhes da Consulta**
2. Clique em **Visualizar Email de Lembrete**
3. Veja o preview exato do email que será enviado
4. Pode enviar um **Email Teste** para verificar

### Marcar Consulta como Atendida

**Opção 1 - Pelo Modal de Detalhes:**
1. Abra os **Detalhes da Consulta**
2. Clique em **Marcar como Atendida**
3. Confirme a ação
4. ✅ Consulta marcada como concluída e lembretes desativados

**Opção 2 - Quando o horário passou:**
- O sistema detecta automaticamente
- Mostra mensagem "Horário da consulta já passou"
- Oferece botão para marcar como atendida

## 🔧 Arquitetura Técnica

### Arquivos Criados

```
src/
├── services/
│   ├── reminderService.js       # Lógica de lembretes e contador
│   └── emailService.js           # Envio de emails (integrado)
├── components/
│   ├── common/
│   │   └── ReminderEmailPreview.jsx  # Preview do email
│   └── scheduling/
│       └── Consultas.jsx         # Atualizado com lembretes
```

### Funções Principais

#### `reminderService.js`

```javascript
// Calcula tempo restante até a consulta
calcularTempoRestante(dataHoraConsulta)

// Gera HTML do email com contador e documentos
gerarEmailLembrete(consulta, tempoRestante, config)

// Salva configuração de lembretes
salvarConfiguracaoLembrete(consultaId, config)

// Obtém configuração de lembretes
obterConfiguracaoLembrete(consultaId)

// Marca consulta como atendida
marcarComoAtendida(consultaId)

// Confirma comparecimento do paciente
confirmarComparecimento(consultaId)
```

#### `emailService.js`

```javascript
// Envia lembrete automático
sendReminderEmail(consulta)

// Inicia sistema de lembretes automáticos
iniciarSistemaLembretes()
```

### LocalStorage

O sistema utiliza localStorage para persistência:

```javascript
{
  // Configurações de lembrete por consulta
  "reminderConfig": {
    "consulta_123": {
      "frequenciaMinutos": 30,
      "antecedenciaHoras": 24,
      "lembreteUrgente": 60,
      "habilitado": true,
      "atualizadoEm": "2025-12-09T10:30:00Z"
    }
  },
  
  // Histórico de lembretes enviados
  "reminderHistory": [
    {
      "consultaId": "consulta_123",
      "enviadoEm": "2025-12-09T10:00:00Z",
      "tempoRestante": "2h 30min",
      "recipient": "paciente@email.com"
    }
  ]
}
```

## 📧 Template de Email

O email gerado inclui:

1. **Header com gradiente** (cor varia com urgência)
2. **Badge de urgência** (emoji + mensagem)
3. **Contador regressivo grande** (destaque visual)
4. **Card com informações da consulta**
   - Data e hora
   - Médico e especialidade
   - Local (presencial) ou link (online)
5. **Seção de documentos obrigatórios** (fundo amarelo)
6. **Botão CTA** para confirmar comparecimento
7. **Link para alterar** configurações de lembrete
8. **Footer** com informações do sistema

## 🎨 Estilos e Cores

### Cores por Urgência

```css
/* Normal (> 3h) */
--cor-tema: #3B82F6 (azul)

/* Alerta (1-3h) */
--cor-tema: #F59E0B (laranja)

/* Urgente (< 1h) */
--cor-tema: #EF4444 (vermelho)
```

### Componentes Visuais

- **Contador**: Fonte 48px, peso 800, cor dinâmica
- **Documentos**: Fundo #fef3c7, borda #f59e0b
- **Botão CTA**: Gradiente com cor dinâmica
- **Cards**: Border-radius 12px, sombra suave

## ⚙️ Configuração Avançada

### Personalizar Frequências

Edite as opções em `Consultas.jsx`:

```javascript
{[5, 15, 30, 60].map(minutos => (
  // Adicione mais valores se necessário
  // Ex: [5, 10, 15, 30, 45, 60, 120]
))}
```

### Alterar Antecedência Padrão

Em `reminderService.js`:

```javascript
export function agendarLembretes(consulta, configuracao = {}) {
  const {
    frequenciaMinutos = 30,    // Mude aqui
    antecedenciaHoras = 24,    // Mude aqui
    lembreteUrgente = 60,      // Mude aqui
  } = configuracao;
}
```

### Integrar com Serviço de Email Real

Atualmente usa simulação. Para integrar:

1. **SendGrid**:
```javascript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendReminderEmail(consulta) {
  const msg = {
    to: consulta.paciente.email,
    from: 'noreply@sitpm.com.br',
    subject: `Lembrete: Consulta ${tempoRestante.texto}`,
    html: gerarEmailLembrete(consulta, tempoRestante, config),
  };
  
  await sgMail.send(msg);
}
```

2. **AWS SES**:
```javascript
import AWS from 'aws-sdk';
const ses = new AWS.SES({ region: 'us-east-1' });

export async function sendReminderEmail(consulta) {
  const params = {
    Destination: {
      ToAddresses: [consulta.paciente.email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: gerarEmailLembrete(consulta, tempoRestante, config),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Lembrete: Consulta ${tempoRestante.texto}`,
      },
    },
    Source: 'noreply@sitpm.com.br',
  };
  
  await ses.sendEmail(params).promise();
}
```

## 🐛 Troubleshooting

### Lembretes não estão sendo enviados

1. Verifique se `habilitado: true` na configuração
2. Confira se a consulta está com `status: 'agendada'`
3. Veja o console do navegador para erros
4. Confirme que `iniciarSistemaLembretes()` foi chamado

### Contador mostrando tempo errado

1. Verifique o formato da data: deve ser ISO 8601
2. Confira timezone do navegador
3. Use `new Date(consulta.dataHora)` para debug

### Email não renderizando corretamente

1. Teste em diferentes clientes de email
2. Use ferramentas como Litmus ou Email on Acid
3. Valide HTML com W3C Validator
4. Evite usar position: absolute no email

## 📊 Métricas e Analytics

Para adicionar tracking:

```javascript
// No gerarEmailLembrete, adicione:
<img src="https://analytics.sitpm.com.br/track.gif?consulta=${consulta.id}&tipo=abertura" 
     width="1" height="1" alt="" />

// Nos links:
<a href="${baseUrl}/confirmar?consulta=${consulta.id}&utm_source=email&utm_medium=reminder">
```

## 🔐 Segurança e Privacidade

- ✅ Dados armazenados localmente (localStorage)
- ✅ Sem envio de dados sensíveis para servidores
- ✅ Links de confirmação podem ter tokens únicos
- ⚠️ Em produção: use HTTPS, hash de tokens, expiração

## 📱 Responsividade

O email é otimizado para:
- ✅ Desktop (Outlook, Gmail, Apple Mail)
- ✅ Mobile (iOS Mail, Gmail App, Outlook Mobile)
- ✅ Webmail (Gmail, Outlook.com, Yahoo)

Media queries incluídas para mobile < 600px.

## 🎯 Próximos Passos

- [ ] Integração com backend real
- [ ] Notificações push (web push API)
- [ ] SMS como alternativa ao email
- [ ] WhatsApp Business API
- [ ] Dashboard de analytics de lembretes
- [ ] A/B testing de templates
- [ ] Testes automatizados

## 📄 Licença

Este sistema faz parte do SITPM - Sistema Integrado de Triagem e Pré-Atendimento Médico.

---

Desenvolvido com ❤️ para melhorar o atendimento médico e reduzir faltas em consultas.
