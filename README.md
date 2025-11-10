# SIT-PM-UI - Sistema Médico Front-End

## 📁 Estrutura do Projeto

```
SIT-PM-UI/
├── docs/                        # Documentação do projeto
│   ├── DOCUMENTACAO_DETALHADA.md
│   ├── README.md
│   └── LICENSE
│
├── public/                      # Arquivos públicos estáticos
│   └── favicon.svg
│
├── src/                         # Código fonte
│   ├── assets/                 # Recursos estáticos (imagens, fontes, etc)
│   │
│   ├── components/             # Componentes React organizados por funcionalidade
│   │   ├── auth/              # Componentes de autenticação
│   │   │   ├── Auth.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── GoogleAuthModal.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── scheduling/        # Componentes de agendamento
│   │   │   ├── Agendar.jsx
│   │   │   ├── CalendarioAgendamento.jsx
│   │   │   ├── Consultas.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── medical/           # Componentes médicos
│   │   │   ├── Prontuario.jsx
│   │   │   ├── TriagemIA.jsx
│   │   │   ├── Cadastro.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── dashboard/         # Componentes do dashboard
│   │   │   ├── SITPMDashboard.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── common/            # Componentes comuns/compartilhados
│   │   │   ├── Sidebar.jsx
│   │   │   ├── EmailPreview.jsx
│   │   │   └── index.js
│   │   │
│   │   └── index.js           # Exportações centralizadas de componentes
│   │
│   ├── services/              # Serviços e integrações
│   │   ├── emailService.js
│   │   └── gemini.js
│   │
│   ├── styles/                # Estilos globais
│   │   └── styles.css
│   │
│   ├── App.jsx                # Componente principal
│   └── main.jsx               # Ponto de entrada da aplicação
│
├── .env                        # Variáveis de ambiente
├── .env.local                  # Variáveis de ambiente locais
├── .gitignore                  # Arquivos ignorados pelo Git
├── index.html                  # HTML principal
├── package.json                # Dependências e scripts
├── postcss.config.cjs          # Configuração do PostCSS
├── tailwind.config.cjs         # Configuração do Tailwind CSS
├── vite.config.js              # Configuração do Vite
└── server.js                   # Servidor Node.js
```

## 📦 Como Importar Componentes

Com a nova estrutura organizada, você pode importar componentes de várias formas:

### Importação por categoria:
```javascript
import { Auth, Login, GoogleAuthModal } from '@/components/auth';
import { Agendar, Consultas, CalendarioAgendamento } from '@/components/scheduling';
import { Prontuario, TriagemIA, Cadastro } from '@/components/medical';
import { SITPMDashboard } from '@/components/dashboard';
import { Sidebar, EmailPreview } from '@/components/common';
```

### Importação centralizada:
```javascript
import { 
  Auth, 
  Login, 
  Agendar, 
  Consultas, 
  Prontuario, 
  SITPMDashboard, 
  Sidebar 
} from '@/components';
```

### Importação direta:
```javascript
import Auth from '@/components/auth/Auth.jsx';
import Agendar from '@/components/scheduling/Agendar.jsx';
```

## 🎯 Organização por Funcionalidade

- **auth/**: Tudo relacionado a autenticação e login
- **scheduling/**: Agendamentos, calendário e consultas
- **medical/**: Prontuários, triagem e cadastros médicos
- **dashboard/**: Interface principal do sistema
- **common/**: Componentes reutilizáveis em todo o sistema
- **services/**: Integrações com APIs e serviços externos
- **styles/**: Estilos globais da aplicação
- **docs/**: Documentação completa do projeto

## 🚀 Benefícios da Nova Estrutura

- ✅ **Fácil navegação**: Encontre arquivos rapidamente pela funcionalidade
- ✅ **Manutenção simplificada**: Alterações em uma área não afetam outras
- ✅ **Escalabilidade**: Fácil adicionar novos componentes e funcionalidades
- ✅ **Imports limpos**: Arquivos index.js facilitam importações
- ✅ **Separação de responsabilidades**: Cada pasta tem um propósito claro
