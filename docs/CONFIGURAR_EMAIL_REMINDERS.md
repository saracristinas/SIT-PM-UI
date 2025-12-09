# 📧 Configurar Envio de Lembretes por Email

## Visão Geral

O sistema de lembretes automáticos agora envia **emails reais** para os pacientes quando as consultas se aproximam.

Os emails são enviados através de um servidor Node.js com nodemailer, que se conecta a um servidor SMTP.

## Pré-requisitos

1. **Node.js** instalado (v14+)
2. **Conta Gmail** (ou outro provedor de email SMTP)
3. **Porta 3001** disponível (ou modificar em server.js)

## Configurar Gmail para Envio de Emails

### 1. Habilitar Autenticação em 2 Fatores

1. Acesse sua conta Google: https://myaccount.google.com
2. Vá para **"Segurança"** (lado esquerdo)
3. Role para baixo e ative **"Autenticação de 2 fatores"**

### 2. Gerar Senha de App

1. Após ativar 2FA, volte para **"Segurança"**
2. Procure por **"Senhas de app"** (abaixo de Autenticação 2FA)
3. Selecione:
   - **App**: Mail
   - **Device**: Windows Computer (ou seu sistema)
4. Google gerará uma senha de 16 caracteres
5. **Copie essa senha** - você usará no `.env`

### 3. Criar Arquivo `.env`

Na raiz do projeto, crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# Porta do servidor
PORT=3001

# Configurações SMTP para Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app-16-caracteres

# Nome da Clínica
EMAIL_FROM_NAME=MediCenter
CLINIC_NAME=MediCenter
```

**Exemplo real:**
```env
PORT=3001
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=clinica.medical@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM_NAME=MediCenter
CLINIC_NAME=MediCenter
```

## Iniciar o Servidor de Email

### Terminal 1 - Servidor de Email (Node.js)

```bash
npm run dev
# ou
node server.js
```

Você deve ver:
```
🚀 Servidor de email rodando na porta 3001
📧 SMTP configurado: smtp.gmail.com:587
✉️  Remetente: seu-email@gmail.com
```

### Terminal 2 - Aplicação React (Vite)

```bash
npm run dev:app
```

## Como Funciona

### 1. Usuário Agenda uma Consulta

- Modal aparece perguntando sobre lembretes
- Usuário configura frequência (5, 15, 30, 60 minutos)
- Usuário configura com quanto tempo antes começar (1, 6, 12, 24 horas)

### 2. Sistema Verifica Lembretes a Cada Minuto

- A cada 60 segundos, o sistema verifica se há consultas próximas
- Compara tempo atual com hora da consulta
- Se dentro da janela de frequência, envia email

### 3. Email é Enviado

- Servidor recebe requisição POST em `/api/send-reminder`
- Conecta ao SMTP do Gmail
- Envia email HTML formatado para o paciente
- Salva registro no histórico (localStorage)

### 4. Notificação Aparece no App

- Toast verde/laranja/vermelho aparece no canto inferior direito
- Mostra nome do médico, especialidade e horário
- Desaparece após 8 segundos automaticamente

## Endpoints da API

### POST `/api/send-reminder`

Envia um lembrete de consulta por email.

**Request Body:**
```json
{
  "paciente": {
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "medico": "Dr. Carlos",
  "especialidade": "Cardiologia",
  "dataHora": "2025-12-15T14:30:00",
  "tempoRestante": {
    "totalMinutos": 120,
    "texto": "2 horas"
  },
  "frequencia": 30,
  "nomeClinica": "MediCenter"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Lembrete enviado com sucesso",
  "messageId": "msg-id-123",
  "recipient": "joao@email.com",
  "medico": "Dr. Carlos",
  "dataHora": "2025-12-15T14:30:00",
  "timestamp": "2025-12-15T12:30:00Z"
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Erro ao enviar lembrete",
  "error": "Detalhes do erro"
}
```

### GET `/api/test`

Testa se o servidor está funcionando.

**Response:**
```json
{
  "status": "OK",
  "message": "Servidor de email funcionando!",
  "timestamp": "2025-12-15T12:30:00Z"
}
```

## Troubleshooting

### Erro: "getaddrinfo ENOTFOUND smtp.gmail.com"
- Verifique conexão de internet
- Confirme que SMTP_HOST está correto
- Tente ping: `ping smtp.gmail.com`

### Erro: "Invalid login: 535-5.7.8 Username and password not accepted"
- Verifique se a senha de app tem 16 caracteres
- Regenere a senha de app no Google
- Verifique espaços em branco antes/depois da senha

### Erro: "connect ECONNREFUSED ::1:3001"
- Servidor Node não está rodando
- Execute `npm run dev` em outro terminal
- Verifique porta 3001 disponível

### Emails não chegam/vão para spam
- Google pode estar bloqueando como "app inseguro"
- Acesse: https://myaccount.google.com/apppasswords
- Verifique filtros de spam do email de destino
- Teste com email pessoal primeiro

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| PORT | Porta do servidor Node | 3001 |
| SMTP_HOST | Servidor SMTP | smtp.gmail.com |
| SMTP_PORT | Porta SMTP | 587 |
| SMTP_SECURE | TLS (false) ou SSL (true) | false |
| SMTP_USER | Email do remetente | - |
| SMTP_PASS | Senha de app | - |
| EMAIL_FROM_NAME | Nome que aparece no email | MediCenter |
| CLINIC_NAME | Nome da clínica | MediCenter |

## Alterar para Outro Provedor

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@outlook.com
SMTP_PASS=sua-senha
```

### SendGrid (Recomendado para produção)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.sua-chave-api
```

### AWS SES
```env
SMTP_HOST=email-smtp.seu-região.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-usuario-smtp
SMTP_PASS=sua-senha-smtp
```

## Como o Template de Email Funciona

O email é enviado em HTML + Plain Text:

1. **Header com Gradiente Azul**
   - Muda de cor baseado na urgência
   - Azul: Normal
   - Laranja: < 3 horas
   - Vermelho: < 1 hora

2. **Informações da Consulta**
   - Médico, especialidade, data, horário
   - Formatado em cards azuis

3. **Contador Regressivo**
   - "Falta X horas Y minutos"
   - Destaque em amarelo

4. **Lista de Documentos**
   - RG/CNH
   - Cartão do convênio
   - Pedido médico
   - Lista de medicamentos

5. **Footer**
   - Timestamp de envio
   - Nome da clínica
   - Aviso de email automático

## Histórico de Lembretes

O sistema mantém histórico em `localStorage`:

```javascript
// Acessar histórico
const historico = JSON.parse(localStorage.getItem('reminderHistory') || '[]');

// Estrutura de cada entrada
{
  consultaId: "consulta-id",
  enviadoEm: "2025-12-15T12:30:00Z",
  tempoRestante: "2 horas",
  recipient: "paciente@email.com",
  messageId: "msg-id-123"
}
```

## Próximas Melhorias

- [ ] Dashboard de histórico de lembretes enviados
- [ ] Relatório de taxa de entrega de emails
- [ ] Rastreamento de emails abertos
- [ ] Templates personalizáveis por clínica
- [ ] Integração com SendGrid/AWS para produção
- [ ] Banco de dados para persistência de histórico
- [ ] Tentativas de reenvio automático

## Suporte

Para problemas com configuração de email:
1. Verifique console do navegador (F12)
2. Verifique logs do servidor Node
3. Teste endpoint com Postman: `POST http://localhost:3001/api/send-reminder`
4. Verifique arquivo `.env` tem variáveis corretas
