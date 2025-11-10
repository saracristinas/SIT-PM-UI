# 📚 Guia de Importações - SIT-PM-UI

Este guia mostra como importar componentes após a reorganização da estrutura do projeto.

## 🎯 Estrutura de Componentes

### 🔐 Autenticação (`src/components/auth/`)
- `Auth.jsx` - Componente principal de autenticação
- `Login.jsx` - Formulário de login
- `GoogleAuthModal.jsx` - Modal para autenticação Google

**Exemplos de Importação:**
```javascript
// Importação individual
import Auth from '@/components/auth/Auth';
import Login from '@/components/auth/Login';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';

// Importação via index
import { Auth, Login, GoogleAuthModal } from '@/components/auth';
```

---

### 📅 Agendamento (`src/components/scheduling/`)
- `Agendar.jsx` - Formulário de agendamento de consultas
- `CalendarioAgendamento.jsx` - Calendário para seleção de datas
- `Consultas.jsx` - Listagem e gerenciamento de consultas

**Exemplos de Importação:**
```javascript
// Importação individual
import Agendar from '@/components/scheduling/Agendar';
import CalendarioAgendamento from '@/components/scheduling/CalendarioAgendamento';
import Consultas from '@/components/scheduling/Consultas';

// Importação via index
import { Agendar, CalendarioAgendamento, Consultas } from '@/components/scheduling';
```

---

### 🏥 Médico (`src/components/medical/`)
- `Prontuario.jsx` - Sistema de prontuário eletrônico
- `TriagemIA.jsx` - Triagem inteligente com IA
- `Cadastro.jsx` - Cadastro de pacientes

**Exemplos de Importação:**
```javascript
// Importação individual
import Prontuario from '@/components/medical/Prontuario';
import TriagemIA from '@/components/medical/TriagemIA';
import Cadastro from '@/components/medical/Cadastro';

// Importação via index
import { Prontuario, TriagemIA, Cadastro } from '@/components/medical';
```

---

### 📊 Dashboard (`src/components/dashboard/`)
- `SITPMDashboard.jsx` - Dashboard principal do sistema

**Exemplos de Importação:**
```javascript
// Importação individual
import SITPMDashboard from '@/components/dashboard/SITPMDashboard';

// Importação via index
import { SITPMDashboard } from '@/components/dashboard';
```

---

### 🔧 Comuns (`src/components/common/`)
- `Sidebar.jsx` - Barra lateral de navegação
- `EmailPreview.jsx` - Preview de e-mails

**Exemplos de Importação:**
```javascript
// Importação individual
import Sidebar from '@/components/common/Sidebar';
import EmailPreview from '@/components/common/EmailPreview';

// Importação via index
import { Sidebar, EmailPreview } from '@/components/common';
```

---

## 🛠️ Serviços (`src/services/`)
- `emailService.js` - Serviço de envio de e-mails
- `gemini.js` - Integração com Gemini AI

**Exemplos de Importação:**
```javascript
import { enviarEmailConsultaAgendada } from '@/services/emailService';
import { 
  sendMessageToGemini, 
  startTriagem, 
  analyzeSymptomSeverity, 
  detectarIntencaoAgendamento 
} from '@/services/gemini';
```

---

## 🎨 Estilos (`src/styles/`)
- `styles.css` - Estilos globais da aplicação

**Exemplo de Importação:**
```javascript
import '@/styles/styles.css';
```

---

## 💡 Importação Centralizada

Você pode importar múltiplos componentes de uma vez usando o index principal:

```javascript
// Importar de diferentes categorias
import { 
  Auth,           // de auth
  Login,          // de auth
  Agendar,        // de scheduling
  Consultas,      // de scheduling
  Prontuario,     // de medical
  TriagemIA,      // de medical
  SITPMDashboard, // de dashboard
  Sidebar,        // de common
  EmailPreview    // de common
} from '@/components';
```

---

## 📝 Notas Importantes

1. **Alias `@`**: Se configurado no `vite.config.js`, você pode usar `@` como alias para `src/`
2. **Extensões**: Não é necessário incluir `.jsx` nas importações
3. **Named Exports**: Os arquivos `index.js` usam named exports para facilitar as importações
4. **Paths Relativos**: Dentro dos componentes, use caminhos relativos quando necessário:
   - `../` para subir um nível
   - `../../` para subir dois níveis

---

## 🔄 Migração de Imports Antigos

Se você tem imports antigos, aqui está como migrar:

### Antes:
```javascript
import Sidebar from './components/Sidebar';
import SITPMDashboard from './components/SITPMDashboard';
import TriagemIA from './components/TriagemIA';
import Agendar from './components/Agendar';
```

### Depois:
```javascript
import Sidebar from './components/common/Sidebar';
import SITPMDashboard from './components/dashboard/SITPMDashboard';
import TriagemIA from './components/medical/TriagemIA';
import Agendar from './components/scheduling/Agendar';

// OU usando importação centralizada:
import { 
  Sidebar, 
  SITPMDashboard, 
  TriagemIA, 
  Agendar 
} from './components';
```

---

## ✅ Checklist de Migração

- [x] Componentes de autenticação movidos para `auth/`
- [x] Componentes de agendamento movidos para `scheduling/`
- [x] Componentes médicos movidos para `medical/`
- [x] Dashboard movido para `dashboard/`
- [x] Componentes comuns movidos para `common/`
- [x] Estilos movidos para `styles/`
- [x] Arquivos `index.js` criados em cada pasta
- [x] Imports atualizados em `App.jsx`
- [x] Imports atualizados em `main.jsx`
- [x] Imports internos entre componentes atualizados
