# 🏥 SITPM - Sistema Inteligente de Triagem e Pré-diagnóstico Médico

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-cyan?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 📚 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Páginas e Funcionalidades](#-páginas-e-funcionalidades)
- [Como Funciona](#-como-funciona)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Arquitetura](#-arquitetura)

---

## 🎯 Sobre o Projeto

O **SITPM** é um sistema web moderno e intuitivo para gestão de consultas médicas e triagem inteligente de pacientes. Desenvolvido com tecnologias de ponta, oferece uma experiência fluida tanto para profissionais de saúde quanto para pacientes.

### ✨ Principais Características

- 🤖 **Triagem IA**: Assistente virtual para análise preliminar de sintomas
- 📅 **Agendamento**: Sistema completo de marcação de consultas
- 📋 **Gestão de Consultas**: CRUD completo com histórico
- 📄 **Prontuário Digital**: Acesso centralizado ao histórico médico
- 🌓 **Modo Escuro**: Interface adaptável para conforto visual
- 📱 **100% Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

---

## 🛠️ Tecnologias Utilizadas

Vamos entender cada tecnologia usada no projeto de forma didática:

### 1. **React** (v18.2.0)
> **O que é?** Uma biblioteca JavaScript para construir interfaces de usuário.

**Por que usamos?**
- Permite criar componentes reutilizáveis (como blocos de LEGO)
- Atualiza apenas o que mudou na tela (muito rápido!)
- Facilita o gerenciamento do estado da aplicação

**Exemplo no projeto:**
```jsx
// Cada página é um componente React
function Dashboard() {
  return <div>Conteúdo do Dashboard</div>
}
```

### 2. **Vite** (v5.0.0)
> **O que é?** Uma ferramenta de build extremamente rápida para projetos web.

**Por que usamos?**
- ⚡ Inicialização instantânea do servidor de desenvolvimento
- 🔥 Atualização em tempo real (Hot Module Replacement)
- 📦 Build otimizado para produção
- 🚀 Muito mais rápido que o Webpack tradicional

**Comandos principais:**
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria versão otimizada para produção
npm run preview  # Visualiza a versão de produção
```

### 3. **Tailwind CSS** (v3.4.18)
> **O que é?** Um framework CSS utility-first (baseado em classes utilitárias).

**Por que usamos?**
- 🎨 Estilização rápida direto no HTML/JSX
- 📱 Sistema de responsividade integrado
- 🌙 Suporte nativo a modo escuro
- 💪 Classes prontas para uso (flex, grid, padding, margin, etc.)

**Exemplo no projeto:**
```jsx
// Ao invés de criar arquivos CSS separados:
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  // flex = display flex
  // items-center = alinha verticalmente no centro
  // gap-4 = espaçamento de 16px entre elementos
  // p-6 = padding de 24px
  // bg-white = fundo branco
  // rounded-lg = bordas arredondadas grandes
  // shadow-md = sombra média
</div>
```

### 4. **Lucide React** (v0.552.0)
> **O que é?** Biblioteca de ícones SVG modernos e otimizados.

**Por que usamos?**
- 🎯 Ícones bonitos e profissionais
- 📦 Tree-shaking (só importa os ícones que usa)
- ⚡ Leves e vetoriais (escalam sem perder qualidade)

**Exemplo no projeto:**
```jsx
import { Calendar, User, HeartPulse } from 'lucide-react'

<Calendar className="w-6 h-6 text-blue-500" />
```

---

## 📁 Estrutura do Projeto

```
SIT-PM-UI/
├── 📂 public/                  # Arquivos públicos estáticos
│   └── favicon.svg            # Ícone da aba do navegador
│
├── 📂 src/                     # Código fonte principal
│   ├── 📂 components/         # Componentes React reutilizáveis
│   │   ├── Sidebar.jsx        # Barra lateral de navegação
│   │   ├── SITPMDashboard.jsx # Página inicial (Dashboard)
│   │   ├── TriagemIA.jsx      # Assistente de triagem
│   │   ├── Agendar.jsx        # Formulário de agendamento
│   │   ├── Consultas.jsx      # Lista e gestão de consultas
│   │   └── Prontuario.jsx     # Prontuário médico
│   │
│   ├── App.jsx                # Componente raiz (gerencia estado global)
│   ├── main.jsx               # Ponto de entrada da aplicação
│   └── styles.css             # Estilos globais e Tailwind
│
├── 📄 index.html              # HTML principal
├── 📄 package.json            # Dependências e scripts
├── 📄 tailwind.config.cjs     # Configuração do Tailwind
├── 📄 postcss.config.cjs      # Configuração do PostCSS
└── 📄 vite.config.js          # Configuração do Vite
```

---

## 📄 Páginas e Funcionalidades

### 1️⃣ **Dashboard (Início)** 📊
> Página inicial com visão geral do sistema

**O que faz:**
- Exibe a próxima consulta agendada
- Mostra histórico de consultas
- Cards com estatísticas rápidas
- Acesso rápido às principais funcionalidades

**Componentes principais:**
```jsx
// Card da próxima consulta
<div className="bg-gradient-to-br from-emerald-500 to-emerald-400">
  <h3>Próxima Consulta</h3>
  <p>Data: 15/11/2025 às 14:30</p>
</div>

// Filtros do histórico
<button onClick={() => setFiltro('todas')}>Todas</button>
<button onClick={() => setFiltro('agendadas')}>Agendadas</button>
<button onClick={() => setFiltro('concluidas')}>Concluídas</button>
```

**Estados React:**
- `showHistoricoModal`: Controla abertura do modal de histórico
- `filtroHistorico`: Filtra consultas por status ('todas', 'agendadas', etc.)

---

### 2️⃣ **Triagem IA** 🤖
> Assistente virtual para análise preliminar de sintomas

**O que faz:**
- Chat interativo com IA simulada
- Histórico de triagens anteriores (sidebar lateral)
- Botão "Nova Triagem" para iniciar nova conversa
- Sistema de mensagens com efeito "digitando..."

**Como funciona:**

1. **Estado das Triagens:**
```jsx
const [triagens, setTriagens] = useState([
  {
    id: 1,
    title: 'Triagem - 02/11/2025, 23:2...',
    date: '03 de nov., 02:22',
    messages: [
      { id: 1, type: 'bot', text: 'Olá! Descreva seus sintomas.' },
      { id: 2, type: 'user', text: 'Estou com dor de cabeça.' }
    ]
  }
])
```

2. **Envio de Mensagem:**
```jsx
const handleSendMessage = () => {
  // 1. Adiciona mensagem do usuário
  // 2. Ativa indicador "digitando..."
  // 3. Aguarda 1.5-2.5 segundos (simula IA processando)
  // 4. Adiciona resposta do bot
}
```

3. **Responsividade:**
- **Desktop (≥1024px)**: Sidebar sempre visível ao lado
- **Mobile/Tablet**: Sidebar oculta, botão menu no header

---

### 3️⃣ **Agendamento** 📅
> Formulário para marcar novas consultas

**O que faz:**
- Formulário completo de agendamento
- Escolha entre consulta presencial ou teleconsulta
- Validação de campos obrigatórios
- Loading animado durante processamento
- Toast de confirmação

**Campos do formulário:**
```jsx
{
  datetime: '',      // Data e hora da consulta
  type: 'presencial', // Tipo: 'presencial' ou 'teleconsulta'
  medico: '',        // Nome do médico (opcional)
  motivo: ''         // Motivo da consulta (obrigatório)
}
```

**Fluxo de agendamento:**
```jsx
handleSubmit() {
  // 1. Valida se data/hora e motivo estão preenchidos
  // 2. Ativa loading (1-1.5s para simular processamento)
  // 3. Cria objeto de consulta com status 'agendada'
  // 4. Envia para App.jsx via onAgendarConsulta()
  // 5. Navega para página de consultas
  // 6. Exibe toast de sucesso
}
```

---

### 4️⃣ **Consultas** 📋
> Gestão completa de consultas (CRUD)

**O que faz:**
- Lista todas as consultas ativas
- Filtro por tipo (todas, presencial, teleconsulta)
- Visualização detalhada de cada consulta
- Edição de consultas existentes
- Cancelamento de consultas (mantém no histórico)

**Sistema de Modais:**

1. **Modal de Visualização:**
```jsx
<Modal title="Detalhes da Consulta">
  <p>Data/Hora: {consulta.dataHora}</p>
  <p>Tipo: {consulta.tipo}</p>
  <p>Motivo: {consulta.motivo}</p>
  <p>Status: {consulta.status}</p>
</Modal>
```

2. **Modal de Edição:**
```jsx
<Modal title="Editar Consulta">
  <input value={dataHora} onChange={...} />
  <select value={tipo} onChange={...} />
  <textarea value={motivo} onChange={...} />
  <button onClick={handleSalvar}>Salvar</button>
</Modal>
```

3. **Modal de Cancelamento:**
```jsx
<Modal title="Cancelar Consulta">
  <p>Tem certeza? Esta ação não pode ser desfeita.</p>
  <button onClick={handleConfirmarCancelamento}>Confirmar</button>
</Modal>
```

**Status de Consultas:**
- 🔵 **agendada**: Consulta marcada
- 🟢 **concluida**: Consulta realizada
- 🔴 **cancelada**: Consulta cancelada (fica no histórico)

---

### 5️⃣ **Prontuário** 📄
> Histórico médico completo do paciente

**O que faz:**
- Exibe estatísticas (consultas, exames, receitas)
- Sistema de busca no histórico
- Visualização de documentos médicos
- Cards informativos

**Estrutura:**
```jsx
const stats = [
  { label: 'Total', value: 0, color: 'emerald' },
  { label: 'Consultas', value: 0, color: 'blue' },
  { label: 'Exames', value: 0, color: 'purple' },
  { label: 'Receitas', value: 0, color: 'cyan' }
]
```

---

## 🔄 Como Funciona

### **Arquitetura de Componentes**

```
┌─────────────────────────────────────────┐
│            App.jsx (Raiz)               │
│  ┌─────────────────────────────────┐   │
│  │   Estado Global                 │   │
│  │   - darkMode                    │   │
│  │   - currentPage                 │   │
│  │   - consultas[]                 │   │
│  │   - sidebarOpen                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │                    │
         │                    │
    ┌────▼─────┐         ┌───▼──────────────┐
    │ Sidebar  │         │  Página Atual    │
    │          │         │  (renderPage())  │
    │ - Logo   │         │                  │
    │ - Menu   │         │ Dashboard        │
    │ - Dark   │         │ TriagemIA        │
    │   Mode   │         │ Agendar          │
    └──────────┘         │ Consultas        │
                         │ Prontuario       │
                         └──────────────────┘
```

### **Fluxo de Dados**

1. **Estado Centralizado (App.jsx):**
```jsx
// App.jsx gerencia os dados principais
const [consultas, setConsultas] = useState([])

// Passa funções para componentes filhos
<Agendar onAgendarConsulta={handleAgendarConsulta} />
```

2. **Componente Filho Usa a Função:**
```jsx
// Agendar.jsx
const novaConsulta = { ... }
onAgendarConsulta(novaConsulta) // Chama função do pai
```

3. **Estado é Atualizado:**
```jsx
// App.jsx
const handleAgendarConsulta = (novaConsulta) => {
  setConsultas([...consultas, novaConsulta]) // Adiciona à lista
  setShowSuccessToast(true) // Exibe notificação
}
```

### **Sistema de Navegação**

```jsx
// App.jsx controla qual página mostrar
const [currentPage, setCurrentPage] = useState('inicio')

const renderPage = () => {
  switch (currentPage) {
    case 'inicio': return <Dashboard />
    case 'triagem': return <TriagemIA />
    case 'agendar': return <Agendar />
    // ...
  }
}

// Sidebar muda a página
<button onClick={() => setCurrentPage('triagem')}>
  Triagem IA
</button>
```

### **Modo Escuro**

```jsx
// Estado do modo escuro
const [darkMode, setDarkMode] = useState(false)

// Aplica classes condicionalmente
<div className={`${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
  ...
</div>

// Botão toggle
<button onClick={() => setDarkMode(!darkMode)}>
  <Moon />
</button>
```

### **Responsividade**

O Tailwind CSS usa breakpoints para responsividade:

```jsx
// Exemplo de classe responsiva
<div className="
  w-full           // Mobile: largura total
  lg:w-72          // Desktop (≥1024px): largura 288px
  p-4              // Mobile: padding 16px
  sm:p-6           // Tablet (≥640px): padding 24px
  lg:p-8           // Desktop: padding 32px
">
```

**Breakpoints:**
- `sm:` → 640px (tablet pequeno)
- `md:` → 768px (tablet)
- `lg:` → 1024px (desktop)
- `xl:` → 1280px (desktop grande)

---

## 🚀 Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/saracristinas/SIT-PM-UI.git
cd SIT-PM-UI
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Abra no navegador:**
```
http://localhost:5173
```

### Build para Produção

```bash
# Cria versão otimizada na pasta dist/
npm run build

# Visualiza a versão de produção
npm run preview
```

---

## 💡 Uso

### Desenvolvimento

```bash
# Inicia servidor com hot-reload
npm run dev
```

Agora você pode:
- ✏️ Editar arquivos em `src/`
- 🔄 Ver mudanças instantaneamente no navegador
- 🐛 Debugar com React DevTools

### Produção

```bash
# Build otimizado
npm run build

# Arquivos gerados em dist/
# - HTML minificado
# - CSS otimizado e purificado
# - JavaScript com code splitting
# - Assets otimizados
```

---

## 🏗️ Arquitetura

### **Padrões de Design**

1. **Component-Based Architecture:**
   - Cada parte da UI é um componente isolado
   - Componentes reutilizáveis e testáveis
   - Separação clara de responsabilidades

2. **Props Drilling:**
   - Dados fluem de pai para filho via props
   - Funções são passadas para permitir comunicação filho → pai

3. **State Lifting:**
   - Estado compartilhado fica no componente pai comum
   - Exemplo: `consultas` em App.jsx usado por Dashboard e Consultas

### **Convenções de Código**

```jsx
// 1. Imports organizados
import React, { useState } from 'react'
import { Icon1, Icon2 } from 'lucide-react'
import Component from './Component'

// 2. Componente com export default
export default function MyComponent({ darkMode, onAction }) {
  
  // 3. Estados no início
  const [data, setData] = useState([])
  
  // 4. Funções handlers
  const handleClick = () => { ... }
  
  // 5. Return com JSX
  return (
    <div>...</div>
  )
}
```

### **Boas Práticas Implementadas**

✅ Componentes pequenos e focados  
✅ Nomes descritivos para variáveis e funções  
✅ Comentários em código complexo  
✅ Responsividade mobile-first  
✅ Acessibilidade (ARIA labels quando necessário)  
✅ Performance otimizada (lazy loading, memoization)  

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por tecnologia
- ☕ Muito café
- 🎵 Boa música
- 🚀 Vontade de criar algo incrível

---

## 📞 Suporte

Dúvidas? Abra uma [issue](https://github.com/saracristinas/SIT-PM-UI/issues) no GitHub!

---

**SITPM** - Transformando a gestão médica com tecnologia moderna 🏥✨
 (React + Vite)

Estrutura básica de projeto React usando Vite.

Como usar:

1. Instale dependências

```bash
npm install
```

2. Rode em modo desenvolvimento

```bash
npm run dev
```

3. Build para produção

```bash
npm run build
npm run preview
```

Arquivos criados:
- `index.html` - ponto de entrada HTML
- `vite.config.js` - configuração básica do Vite
- `src/main.jsx` - boot do React
- `src/App.jsx` - componente principal
- `src/styles.css` - estilos básicos
- `package.json` - scripts e dependências

Observações:
- Use Node >= 18 e npm atualizados. Se preferir Yarn ou PNPM, ajuste os comandos.
- Se quiser TypeScript, posso adicionar agora.
