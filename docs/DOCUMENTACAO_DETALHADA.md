# 📖 Documentação Detalhada - SITPM

Este documento explica em detalhes como cada parte do sistema funciona, linha por linha, como se estivéssemos em uma aula.

---

## 📚 Índice

1. [Conceitos Fundamentais](#conceitos-fundamentais)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Componentes Detalhados](#componentes-detalhados)
4. [Fluxos de Dados](#fluxos-de-dados)
5. [Exemplos Práticos](#exemplos-práticos)

---

## 🎓 Conceitos Fundamentais

### O que é um Componente React?

Pense em um componente como uma **peça de LEGO**. Cada peça tem:
- Uma aparência (o que você vê)
- Uma função (o que ela faz)
- Pode se conectar com outras peças

**Exemplo simples:**
```jsx
// Um botão é um componente
function Botao() {
  return <button>Clique aqui</button>
}

// Uma página usa vários componentes
function Pagina() {
  return (
    <div>
      <Botao />
      <Botao />
      <Botao />
    </div>
  )
}
```

### O que é Estado (State)?

Estado é a **memória** do componente. Ele lembra de informações.

**Exemplo do mundo real:**
- Um interruptor de luz tem **estado**: ligado OU desligado
- Um formulário tem **estado**: os dados que você digitou
- Uma lista de compras tem **estado**: os itens adicionados

**No código:**
```jsx
function Contador() {
  // useState cria uma "caixinha" para guardar um número
  const [numero, setNumero] = useState(0)
  
  // numero = valor atual (começa em 0)
  // setNumero = função para mudar o valor
  
  return (
    <div>
      <p>Você clicou {numero} vezes</p>
      <button onClick={() => setNumero(numero + 1)}>
        Clique aqui
      </button>
    </div>
  )
}
```

### O que são Props?

Props são **informações passadas de um componente pai para um filho**.

**Exemplo do mundo real:**
- Você (pai) dá dinheiro (prop) para seu filho ir à loja
- Um professor (pai) passa exercícios (props) para os alunos (filhos)

**No código:**
```jsx
// Componente filho recebe props
function CartaoUsuario({ nome, idade }) {
  return (
    <div>
      <h2>{nome}</h2>
      <p>{idade} anos</p>
    </div>
  )
}

// Componente pai passa props
function ListaUsuarios() {
  return (
    <div>
      <CartaoUsuario nome="João" idade={25} />
      <CartaoUsuario nome="Maria" idade={30} />
    </div>
  )
}
```

---

## 📁 Estrutura de Arquivos

### main.jsx - O Início de Tudo

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// 1. Encontra o elemento HTML com id="root"
// 2. Transforma em um "root" do React
ReactDOM.createRoot(document.getElementById('root')).render(
  // 3. Renderiza o componente App dentro do root
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**O que acontece:**
1. React procura `<div id="root">` no `index.html`
2. Coloca o componente `<App />` dentro dessa div
3. `StrictMode` ativa avisos úteis durante desenvolvimento

### index.html - A Base

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SITPM - Sistema Inteligente de Triagem</title>
  </head>
  <body>
    <!-- React vai inserir tudo aqui -->
    <div id="root"></div>
    
    <!-- Vite carrega o JavaScript -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Linha por linha:**
- `charset="UTF-8"`: Permite acentos e caracteres especiais
- `favicon.svg`: Ícone que aparece na aba do navegador
- `viewport`: Faz o site funcionar bem no celular
- `<div id="root">`: Container onde React coloca tudo
- `<script src="/src/main.jsx">`: Carrega o JavaScript

---

## 🧩 Componentes Detalhados

### 1. App.jsx - O Cérebro do Sistema

Este é o componente **mais importante**. Ele gerencia tudo.

#### Imports (Importações)

```jsx
import React, { useState } from 'react'
import { Check, Menu, X, Moon, HeartPulse } from 'lucide-react'
import Sidebar from './components/Sidebar'
import SITPMDashboard from './components/SITPMDashboard'
import TriagemIA from './components/TriagemIA'
import Agendar from './components/Agendar'
import Consultas from './components/Consultas'
import Prontuario from './components/Prontuario'
```

**O que significa:**
- `useState`: Hook para criar estado (memória)
- `lucide-react`: Biblioteca de ícones
- `./components/...`: Importa nossos componentes

#### Estados Globais

```jsx
const [darkMode, setDarkMode] = useState(false)
```
**Tradução:** 
- Cria variável `darkMode` que começa como `false` (modo claro)
- `setDarkMode` é a função para mudar entre claro/escuro

```jsx
const [currentPage, setCurrentPage] = useState('inicio')
```
**Tradução:**
- `currentPage` guarda qual página está aberta ('inicio', 'triagem', etc.)
- Começa na página 'inicio'

```jsx
const [consultas, setConsultas] = useState([])
```
**Tradução:**
- Array vazio `[]` que vai guardar todas as consultas
- Cada vez que alguém agenda, uma consulta é adicionada aqui

```jsx
const [sidebarOpen, setSidebarOpen] = useState(false)
```
**Tradução:**
- No mobile, controla se a sidebar está aberta ou fechada
- `false` = fechada, `true` = aberta

#### Função: handleAgendarConsulta

```jsx
const handleAgendarConsulta = (novaConsulta) => {
  // 1. Adiciona a nova consulta ao array
  setConsultas([...consultas, novaConsulta])
  
  // 2. Prepara mensagem do toast
  setToastMessage({
    title: 'Consulta agendada com sucesso!',
    subtitle: 'Sua consulta foi registrada.'
  })
  
  // 3. Mostra o toast
  setShowSuccessToast(true)
  
  // 4. Esconde o toast após 5 segundos
  setTimeout(() => {
    setShowSuccessToast(false)
  }, 5000)
}
```

**Passo a passo:**
1. **Recebe** a nova consulta do componente Agendar
2. **Adiciona** ao array de consultas usando spread operator `...`
3. **Prepara** a mensagem de sucesso
4. **Exibe** notificação (toast)
5. **Agenda** esconder a notificação após 5 segundos

**Analogia:** É como adicionar um item à lista de compras e receber uma confirmação.

#### Função: handleEditarConsulta

```jsx
const handleEditarConsulta = (consultaId, dadosAtualizados) => {
  setConsultas(consultas.map(consulta => 
    consulta.id === consultaId 
      ? { ...consulta, ...dadosAtualizados }
      : consulta
  ))
}
```

**Como funciona:**
- Percorre TODAS as consultas com `.map()`
- Quando encontra a consulta com o ID correto:
  - Pega os dados antigos: `...consulta`
  - Sobrescreve com os novos: `...dadosAtualizados`
- Mantém as outras consultas sem alteração

**Exemplo prático:**
```jsx
// Consulta antiga:
{ id: 1, dataHora: '10/11 14:00', motivo: 'Dor de cabeça' }

// Dados atualizados:
{ motivo: 'Dor de cabeça forte' }

// Resultado:
{ id: 1, dataHora: '10/11 14:00', motivo: 'Dor de cabeça forte' }
```

#### Função: handleExcluirConsulta

```jsx
const handleExcluirConsulta = (consultaId) => {
  setConsultas(consultas.map(consulta => 
    consulta.id === consultaId 
      ? { ...consulta, status: 'cancelada' }
      : consulta
  ))
}
```

**Importante:** Não deleta! Apenas marca como 'cancelada'.

**Por quê?** Para manter histórico. É como arquivar ao invés de jogar fora.

#### Função: renderPage

```jsx
const renderPage = () => {
  switch (currentPage) {
    case 'inicio':
      return <SITPMDashboard darkMode={darkMode} consultas={consultas} />
    case 'triagem':
      return <TriagemIA darkMode={darkMode} />
    case 'agendar':
      return <Agendar onAgendarConsulta={handleAgendarConsulta} />
    // ...
  }
}
```

**Como funciona:**
1. Verifica o valor de `currentPage`
2. Retorna o componente correspondente
3. Passa as props necessárias

**É como um garçom:** Você pede "página triagem" e ele entrega `<TriagemIA />`.

#### JSX do App

```jsx
return (
  <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
    {/* Header Mobile */}
    <div className="fixed top-0 left-0 right-0 h-16 lg:hidden">
      {/* Barra superior só aparece no mobile/tablet */}
    </div>
    
    {/* Sidebar */}
    <Sidebar 
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
    
    {/* Conteúdo Principal */}
    <div className="lg:ml-72 pt-16 lg:pt-0">
      {renderPage()}
    </div>
    
    {/* Toast de Sucesso */}
    {showSuccessToast && <Toast message={toastMessage} />}
  </div>
)
```

**Classes Tailwind explicadas:**
- `min-h-screen`: Altura mínima = altura da tela
- `bg-gray-900`: Fundo cinza escuro (modo escuro)
- `bg-gray-50`: Fundo cinza clarinho (modo claro)
- `fixed top-0 left-0 right-0`: Fixa no topo da tela
- `h-16`: Altura de 64px
- `lg:hidden`: Esconde em telas grandes (≥1024px)
- `lg:ml-72`: No desktop, margem esquerda de 288px (espaço da sidebar)
- `pt-16`: Padding top 64px (espaço do header mobile)
- `lg:pt-0`: No desktop, sem padding top

---

### 2. Sidebar.jsx - Menu de Navegação

#### Estados Locais

```jsx
const menuItems = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'triagem', label: 'Triagem IA', icon: Bot },
  { id: 'agendar', label: 'Agendamento', icon: Calendar },
  { id: 'consultas', label: 'Consultas', icon: FileText },
  { id: 'prontuario', label: 'Prontuário', icon: Heart }
]
```

**Estrutura:** Array de objetos com informações de cada menu.

**Por que assim?** Facilita adicionar/remover itens sem duplicar código.

#### Função: handleMenuClick

```jsx
const handleMenuClick = (pageId) => {
  setCurrentPage(pageId)
  if (setSidebarOpen) setSidebarOpen(false)
}
```

**O que faz:**
1. Muda a página atual
2. Se está no mobile, fecha a sidebar

**Fluxo:**
```
Usuário clica "Triagem IA"
    ↓
handleMenuClick('triagem')
    ↓
setCurrentPage('triagem') → App.jsx renderiza <TriagemIA />
    ↓
setSidebarOpen(false) → Sidebar some no mobile
```

#### JSX Responsivo

```jsx
<div className={`
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  fixed lg:relative
  z-50 lg:z-0
  w-72
  h-full
  transition-transform duration-300
`}>
```

**Linha por linha:**

- `translate-x-0`: Sidebar na posição normal
- `-translate-x-full`: Sidebar escondida à esquerda (fora da tela)
- `lg:translate-x-0`: No desktop, sempre visível
- `fixed`: Posição fixa na tela
- `lg:relative`: No desktop, posição relativa (fluxo normal)
- `z-50`: Fica acima de outros elementos
- `lg:z-0`: No desktop, z-index normal
- `w-72`: Largura 288px
- `transition-transform duration-300`: Animação suave de 300ms

**Comportamento:**

**Mobile:**
```
sidebarOpen = false → translate-x-full (escondida)
sidebarOpen = true  → translate-x-0 (visível)
```

**Desktop (lg:):**
```
Sempre: translate-x-0 (visível)
```

---

### 3. SITPMDashboard.jsx - Página Inicial

#### Cálculo da Próxima Consulta

```jsx
const proximaConsulta = consultas
  .filter(c => c.status === 'agendada')
  .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0]
```

**Passo a passo:**

1. **`.filter(c => c.status === 'agendada')`**
   - Filtra apenas consultas agendadas
   - Remove as concluídas e canceladas

2. **`.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))`**
   - Ordena por data (mais próxima primeiro)
   - Converte string para Date para comparar

3. **`[0]`**
   - Pega a primeira do array (mais próxima)

**Exemplo:**
```jsx
// Consultas:
[
  { dataHora: '15/11/2025 14:00', status: 'agendada' },
  { dataHora: '10/11/2025 10:00', status: 'agendada' },
  { dataHora: '12/11/2025 16:00', status: 'concluida' }
]

// Após filter (remove concluida):
[
  { dataHora: '15/11/2025 14:00', status: 'agendada' },
  { dataHora: '10/11/2025 10:00', status: 'agendada' }
]

// Após sort (ordena por data):
[
  { dataHora: '10/11/2025 10:00', status: 'agendada' }, ← mais próxima
  { dataHora: '15/11/2025 14:00', status: 'agendada' }
]

// [0] retorna:
{ dataHora: '10/11/2025 10:00', status: 'agendada' }
```

#### Filtro de Histórico

```jsx
const consultasFiltradas = filtroHistorico === 'todas'
  ? consultas
  : consultas.filter(c => c.status === filtroHistorico)
```

**Lógica:**
- Se filtro = 'todas' → mostra tudo
- Se filtro = 'agendadas' → mostra só agendadas
- Se filtro = 'concluidas' → mostra só concluídas
- Se filtro = 'canceladas' → mostra só canceladas

**Operador ternário:**
```jsx
condição ? valorSeVerdadeiro : valorSeFalso
```

---

### 4. TriagemIA.jsx - Assistente Virtual

#### Estrutura de Dados

```jsx
const [triagens, setTriagens] = useState([
  {
    id: 1,
    title: 'Triagem - 02/11/2025, 23:2...',
    date: '03 de nov., 02:22',
    messages: [
      { id: 1, type: 'bot', text: 'Olá! Descreva seus sintomas.' },
      { id: 2, type: 'user', text: 'Estou com febre.' },
      { id: 3, type: 'bot', text: 'Entendo. Há quanto tempo?' }
    ]
  }
])
```

**Estrutura:**
- Cada triagem = uma conversa completa
- `messages` = array de mensagens daquela conversa
- `type` = 'bot' ou 'user' (define visual e posição)

#### Função: handleNovaTriagem

```jsx
const handleNovaTriagem = () => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short' 
  })
  const timeStr = now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  const newId = Math.max(...triagens.map(t => t.id)) + 1
  
  const newTriagem = {
    id: newId,
    title: `Triagem - ${now.toLocaleDateString('pt-BR')}, ${timeStr}...`,
    date: `${dateStr}, ${timeStr}`,
    messages: [
      {
        id: 1,
        type: 'bot',
        text: 'Olá! Descreva seus sintomas.'
      }
    ]
  }
  
  setTriagens([newTriagem, ...triagens])
  setActiveTriagemId(newId)
  setShowTriagensSidebar(false)
}
```

**Linha por linha:**

1. **Pega data/hora atual:**
```jsx
const now = new Date() // Ex: 2025-11-03T15:30:00
```

2. **Formata a data:**
```jsx
toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
// Resultado: "03 de nov."
```

3. **Formata a hora:**
```jsx
toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
// Resultado: "15:30"
```

4. **Cria ID único:**
```jsx
Math.max(...triagens.map(t => t.id)) + 1

// Se triagens = [{ id: 1 }, { id: 2 }, { id: 3 }]
// map retorna: [1, 2, 3]
// Math.max(1, 2, 3) = 3
// 3 + 1 = 4 (novo ID)
```

5. **Adiciona ao início do array:**
```jsx
setTriagens([newTriagem, ...triagens])
// Nova triagem primeiro, depois as antigas
```

6. **Ativa a nova triagem:**
```jsx
setActiveTriagemId(newId) // Abre a conversa nova
```

7. **Fecha sidebar no mobile:**
```jsx
setShowTriagensSidebar(false)
```

#### Função: handleSendMessage

```jsx
const handleSendMessage = () => {
  if (!symptoms.trim()) return // Se vazio, não faz nada
  
  const newUserMessage = {
    id: activeTriagem.messages.length + 1,
    type: 'user',
    text: symptoms
  }
  
  // Adiciona mensagem do usuário
  setTriagens(triagens.map(t => 
    t.id === activeTriagemId 
      ? { ...t, messages: [...t.messages, newUserMessage] }
      : t
  ))
  
  setSymptoms('') // Limpa o input
  setIsTyping(true) // Mostra "digitando..."
  
  // Simula IA processando (1.5-2.5s)
  setTimeout(() => {
    const botResponse = {
      id: activeTriagem.messages.length + 2,
      type: 'bot',
      text: 'Entendo seus sintomas. Recomendo consultar um médico.'
    }
    
    setTriagens(prev => prev.map(t => 
      t.id === activeTriagemId 
        ? { ...t, messages: [...t.messages, botResponse] }
        : t
    ))
    
    setIsTyping(false) // Esconde "digitando..."
  }, 1500 + Math.random() * 1000) // Delay aleatório 1.5s-2.5s
}
```

**Fluxo visual:**

```
Usuário digita: "Estou com febre"
    ↓
Clica Enviar
    ↓
handleSendMessage()
    ↓
1. Valida se não está vazio
2. Cria objeto de mensagem do usuário
3. Adiciona às mensagens da triagem ativa
4. Limpa o input
5. Mostra "digitando..." (3 bolinhas animadas)
    ↓
Aguarda 1.5-2.5 segundos
    ↓
6. Cria resposta do bot
7. Adiciona às mensagens
8. Esconde "digitando..."
```

**Update imutável:**
```jsx
setTriagens(triagens.map(t => 
  t.id === activeTriagemId 
    ? { ...t, messages: [...t.messages, newUserMessage] }
    : t
))
```

**Tradução:**
- Percorre todas as triagens
- Se é a triagem ativa:
  - Copia a triagem: `...t`
  - Substitui messages: `[...t.messages, newUserMessage]` (antigas + nova)
- Se não é a ativa: mantém como está

**Por que imutável?** React detecta mudanças comparando referências. Se mutarmos diretamente, React não re-renderiza.

---

### 5. Agendar.jsx - Formulário de Agendamento

#### Estado do Formulário

```jsx
const [formData, setFormData] = useState({
  datetime: '',
  type: 'presencial',
  medico: '',
  motivo: ''
})
```

**Cada campo:**
- `datetime`: Data e hora (input type="datetime-local")
- `type`: Tipo de consulta (presencial ou teleconsulta)
- `medico`: Nome do médico (opcional)
- `motivo`: Motivo da consulta (obrigatório)

#### Inputs Controlados

```jsx
<input
  type="datetime-local"
  value={formData.datetime}
  onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
/>
```

**Como funciona:**

1. **`value={formData.datetime}`**
   - O valor do input sempre vem do estado
   - React controla o input (controlled component)

2. **`onChange`**
   - Dispara quando usuário digita
   - `e.target.value` = novo valor digitado

3. **`setFormData({ ...formData, datetime: e.target.value })`**
   - Copia todo o formData: `...formData`
   - Atualiza apenas datetime: `datetime: e.target.value`
   - Mantém outros campos intactos

**Exemplo:**
```jsx
// Estado antes:
{ datetime: '', type: 'presencial', medico: '', motivo: '' }

// Usuário digita data: "2025-11-15T14:30"

// Estado depois:
{ datetime: '2025-11-15T14:30', type: 'presencial', medico: '', motivo: '' }
```

#### Validação e Envio

```jsx
const handleSubmit = () => {
  // Validação
  if (!formData.datetime || !formData.motivo) {
    alert('Preencha data/hora e motivo!')
    return // Para a execução
  }
  
  setIsLoading(true) // Mostra loading
  
  // Simula processamento (1-1.5s)
  setTimeout(() => {
    const novaConsulta = {
      id: Date.now(), // ID único baseado em timestamp
      dataHora: formData.datetime,
      tipo: formData.type,
      medico: formData.medico,
      motivo: formData.motivo,
      status: 'agendada'
    }
    
    onAgendarConsulta(novaConsulta) // Envia para App.jsx
    
    setIsLoading(false) // Esconde loading
    onNavigate('consultas') // Vai para página de consultas
  }, 1000 + Math.random() * 500) // 1s-1.5s
}
```

**Fluxo completo:**

```
1. Usuário preenche formulário
2. Clica "Agendar Consulta"
3. handleSubmit() valida os campos
4. Se inválido → alert() e para
5. Se válido → mostra loading
6. Aguarda 1-1.5s (simula backend)
7. Cria objeto de consulta
8. Chama onAgendarConsulta() → App.jsx recebe
9. App.jsx adiciona ao array de consultas
10. App.jsx mostra toast de sucesso
11. Navega para página Consultas
12. Esconde loading
```

#### UI de Loading

```jsx
{isLoading && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg">
      <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
      <p>Agendando consulta...</p>
    </div>
  </div>
)}
```

**Classes explicadas:**
- `fixed inset-0`: Cobre toda a tela
- `bg-black/50`: Fundo preto com 50% de transparência
- `z-50`: Fica acima de tudo
- `flex items-center justify-center`: Centraliza o conteúdo
- `animate-spin`: Animação de rotação contínua
- `border-t-transparent`: Borda superior transparente (efeito spinner)

---

### 6. Consultas.jsx - Gestão CRUD

#### Filtro de Consultas

```jsx
const consultasAtivas = consultas.filter(c => c.status !== 'cancelada')
```

**Por que filtrar?**
- Mostra apenas consultas ativas (agendadas ou concluídas)
- Consultas canceladas ficam no histórico do Dashboard

#### Filtro por Tipo

```jsx
const consultasFiltradas = filtroTipo === 'todas'
  ? consultasAtivas
  : consultasAtivas.filter(c => c.tipo === filtroTipo)
```

**Lógica:**
```
filtroTipo = 'todas' → mostra todas
filtroTipo = 'presencial' → filtra tipo presencial
filtroTipo = 'teleconsulta' → filtra tipo teleconsulta
```

#### Modal de Edição

```jsx
const [editandoConsulta, setEditandoConsulta] = useState(null)
const [formEdit, setFormEdit] = useState({
  dataHora: '',
  tipo: '',
  medico: '',
  motivo: ''
})

const abrirModalEditar = (consulta) => {
  setEditandoConsulta(consulta)
  setFormEdit({
    dataHora: consulta.dataHora,
    tipo: consulta.tipo,
    medico: consulta.medico || '',
    motivo: consulta.motivo
  })
  setShowModalEditar(true)
}
```

**Fluxo:**

1. **Usuário clica "Editar" em uma consulta**
2. **`abrirModalEditar(consulta)` é chamado**
3. **Salva qual consulta está sendo editada:**
   ```jsx
   setEditandoConsulta(consulta)
   ```
4. **Preenche o formulário com dados atuais:**
   ```jsx
   setFormEdit({ dataHora: consulta.dataHora, ... })
   ```
5. **Abre o modal:**
   ```jsx
   setShowModalEditar(true)
   ```

**Quando salva:**

```jsx
const handleSalvarEdicao = () => {
  onEditarConsulta(editandoConsulta.id, formEdit)
  setShowModalEditar(false)
  setEditandoConsulta(null)
}
```

1. Chama função do App.jsx com ID e novos dados
2. Fecha modal
3. Limpa estado de edição

#### Status Badge

```jsx
const getStatusBadge = (status) => {
  const badges = {
    agendada: 'bg-blue-100 text-blue-800',
    concluida: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800'
  }
  
  const labels = {
    agendada: 'Agendada',
    concluida: 'Concluída',
    cancelada: 'Cancelada'
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
      {labels[status]}
    </span>
  )
}
```

**Como funciona:**

1. Recebe o status como parâmetro
2. Busca as classes CSS correspondentes no objeto `badges`
3. Busca o label em português no objeto `labels`
4. Retorna um `<span>` estilizado

**Exemplo:**
```jsx
getStatusBadge('agendada')
// Retorna:
<span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  Agendada
</span>
```

---

### 7. Prontuario.jsx - Histórico Médico

#### Estrutura de Estatísticas

```jsx
const stats = [
  { label: 'Total', value: 0, color: 'emerald' },
  { label: 'Consultas', value: 0, color: 'blue' },
  { label: 'Exames', value: 0, color: 'purple' },
  { label: 'Receitas', value: 0, color: 'cyan' }
]
```

**Como usar:**

```jsx
{stats.map((stat) => (
  <div key={stat.label} className={`bg-${stat.color}-50`}>
    <p>{stat.label}</p>
    <p>{stat.value}</p>
  </div>
))}
```

**Por que array de objetos?**
- Evita duplicação de código
- Fácil adicionar novos stats
- Mantém consistência visual

#### Sistema de Busca

```jsx
const [searchQuery, setSearchQuery] = useState('')

<input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Buscar no histórico..."
/>
```

**Futura implementação:**
```jsx
const resultadosFiltrados = documentos.filter(doc => 
  doc.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
  doc.descricao.toLowerCase().includes(searchQuery.toLowerCase())
)
```

---

## 🔄 Fluxos de Dados

### Fluxo 1: Agendar uma Consulta

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário está em Agendar.jsx                             │
│    - Preenche formulário                                     │
│    - Clica "Agendar Consulta"                               │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Agendar.jsx                                              │
│    - handleSubmit() valida campos                           │
│    - Mostra loading (1-1.5s)                                │
│    - Cria objeto novaConsulta                               │
│    - Chama: onAgendarConsulta(novaConsulta)                 │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. App.jsx                                                  │
│    - handleAgendarConsulta() recebe a consulta              │
│    - Adiciona ao array: setConsultas([...consultas, nova])  │
│    - Prepara toast de sucesso                               │
│    - Mostra toast por 5s                                    │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Agendar.jsx (callback)                                   │
│    - Esconde loading                                        │
│    - Navega: onNavigate('consultas')                        │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. App.jsx                                                  │
│    - setCurrentPage('consultas')                            │
│    - renderPage() retorna <Consultas />                     │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Consultas.jsx                                            │
│    - Recebe array de consultas via props                    │
│    - Renderiza a nova consulta na lista                     │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo 2: Trocar Modo Escuro

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica no botão Lua/Sol                          │
│    (Pode estar na Sidebar ou no Header Mobile)              │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Sidebar.jsx                                              │
│    - onClick={() => setDarkMode(!darkMode)}                 │
│    - Chama função que veio do App.jsx via props             │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. App.jsx                                                  │
│    - setDarkMode(!darkMode)                                 │
│    - Estado muda: false → true (ou vice-versa)              │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. React Re-renderiza                                       │
│    - App.jsx passa novo darkMode para todos os componentes  │
│    - Cada componente recebe a nova prop                     │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Componentes Atualizam                                    │
│    - Classes CSS mudam: bg-white → bg-gray-900              │
│    - Ícones mudam: Sun → Moon                               │
│    - Textos mudam: text-gray-900 → text-white               │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo 3: Mensagem no Chat TriagemIA

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário digita "Estou com febre"                        │
│    - Input controlado: value={symptoms}                     │
│    - onChange atualiza estado a cada letra                  │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Usuário pressiona Enter ou clica Enviar                 │
│    - onKeyPress detecta Enter                               │
│    - onClick do botão                                       │
│    - Ambos chamam: handleSendMessage()                      │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. handleSendMessage()                                      │
│    ┌───────────────────────────────────────────────────┐   │
│    │ A. Valida se não está vazio                       │   │
│    │ B. Cria objeto newUserMessage                     │   │
│    │ C. Adiciona às mensagens da triagem ativa         │   │
│    │ D. Limpa input: setSymptoms('')                   │   │
│    │ E. Ativa "digitando...": setIsTyping(true)        │   │
│    └───────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. UI Atualiza                                              │
│    - Mensagem do usuário aparece (alinhada à direita)       │
│    - Input fica vazio                                       │
│    - Aparece indicador "digitando..." (3 bolinhas)          │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. setTimeout() aguarda 1.5-2.5s                            │
│    (Simula IA processando)                                  │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Callback do setTimeout()                                 │
│    ┌───────────────────────────────────────────────────┐   │
│    │ A. Cria objeto botResponse                        │   │
│    │ B. Adiciona às mensagens da triagem ativa         │   │
│    │ C. Desativa "digitando...": setIsTyping(false)    │   │
│    └───────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. UI Atualiza Novamente                                    │
│    - Indicador "digitando..." some                          │
│    - Resposta do bot aparece (alinhada à esquerda)          │
│    - Scroll automático para última mensagem                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Como o Estado Funciona

Imagine que você tem um **caderno** onde anota números:

```jsx
// Criar o caderno com número inicial 0
const [numero, setNumero] = useState(0)

// numero = 0 (valor atual)
// setNumero = função para mudar o número
```

**Ler o número:**
```jsx
<p>O número atual é: {numero}</p>
```

**Mudar o número:**
```jsx
<button onClick={() => setNumero(5)}>
  Mudar para 5
</button>

<button onClick={() => setNumero(numero + 1)}>
  Adicionar 1
</button>
```

**Por que `setNumero` e não `numero = 5`?**

Se você escrever:
```jsx
numero = 5 // ❌ ERRADO!
```

React **não vai perceber** a mudança e não vai atualizar a tela.

Com `setNumero`:
```jsx
setNumero(5) // ✅ CORRETO!
```

React **percebe**, atualiza o estado E re-renderiza a tela.

### Exemplo 2: Props em Ação

**Componente Pai:**
```jsx
function Familia() {
  const nomeMae = "Maria"
  const dinheiro = 50
  
  return (
    <div>
      <h1>Família</h1>
      <Filho nome="João" mesada={dinheiro} />
      <Filho nome="Ana" mesada={dinheiro / 2} />
    </div>
  )
}
```

**Componente Filho:**
```jsx
function Filho({ nome, mesada }) {
  return (
    <div>
      <p>Eu sou {nome}</p>
      <p>Recebi R$ {mesada} de mesada</p>
    </div>
  )
}
```

**Resultado na tela:**
```
Família
Eu sou João
Recebi R$ 50 de mesada

Eu sou Ana
Recebi R$ 25 de mesada
```

### Exemplo 3: Map para Renderizar Listas

Imagine que você tem uma **lista de compras**:

```jsx
const compras = ['Maçã', 'Banana', 'Laranja']
```

**Como mostrar na tela?**

**Jeito ERRADO (repetitivo):**
```jsx
<ul>
  <li>Maçã</li>
  <li>Banana</li>
  <li>Laranja</li>
</ul>
```

**Jeito CERTO (usando map):**
```jsx
<ul>
  {compras.map((item) => (
    <li key={item}>{item}</li>
  ))}
</ul>
```

**O que `map` faz:**
1. Percorre cada item do array
2. Para cada item, cria um `<li>`
3. Retorna array de elementos JSX

**Por que `key`?**

React precisa identificar cada elemento para atualizar apenas o que mudou.

**Exemplo com objetos:**
```jsx
const usuarios = [
  { id: 1, nome: 'João', idade: 25 },
  { id: 2, nome: 'Maria', idade: 30 }
]

return (
  <div>
    {usuarios.map((user) => (
      <div key={user.id}>
        <h3>{user.nome}</h3>
        <p>{user.idade} anos</p>
      </div>
    ))}
  </div>
)
```

### Exemplo 4: Condicionais no JSX

**If/Else Tradicional:**
```jsx
let mensagem
if (darkMode) {
  mensagem = "Modo Escuro Ativado"
} else {
  mensagem = "Modo Claro Ativado"
}

return <p>{mensagem}</p>
```

**Operador Ternário (mais usado):**
```jsx
return (
  <p>{darkMode ? "Modo Escuro" : "Modo Claro"}</p>
)
```

**Renderização Condicional:**
```jsx
return (
  <div>
    {logado ? (
      <p>Bem-vindo!</p>
    ) : (
      <button>Fazer Login</button>
    )}
  </div>
)
```

**Renderizar Apenas Se Verdadeiro:**
```jsx
return (
  <div>
    {temErro && (
      <div className="erro">
        Ops! Algo deu errado.
      </div>
    )}
  </div>
)
```

**Como funciona `&&`:**
```jsx
true && <div>Mostra</div>   // Renderiza a div
false && <div>Não mostra</div>  // Não renderiza nada
```

### Exemplo 5: Event Handlers

**onClick simples:**
```jsx
<button onClick={() => alert('Clicou!')}>
  Clique aqui
</button>
```

**onClick com função:**
```jsx
const handleClick = () => {
  console.log('Botão clicado!')
  setContador(contador + 1)
}

<button onClick={handleClick}>
  Clique aqui
</button>
```

**onChange em Input:**
```jsx
const [texto, setTexto] = useState('')

<input
  value={texto}
  onChange={(e) => setTexto(e.target.value)}
/>

<p>Você digitou: {texto}</p>
```

**onSubmit em Form:**
```jsx
const handleSubmit = (e) => {
  e.preventDefault() // Impede reload da página
  console.log('Formulário enviado!')
}

<form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">Enviar</button>
</form>
```

---

## 🎨 Classes Tailwind Mais Usadas

### Layout

```jsx
// Flexbox
flex                    // display: flex
flex-col                // flex-direction: column
items-center            // align-items: center
justify-center          // justify-content: center
gap-4                   // gap: 1rem (16px)

// Grid
grid                    // display: grid
grid-cols-3             // 3 colunas iguais

// Espaçamento
p-4                     // padding: 1rem (16px)
px-6                    // padding horizontal: 1.5rem (24px)
py-2                    // padding vertical: 0.5rem (8px)
m-4                     // margin: 1rem
mt-2                    // margin-top: 0.5rem
```

### Tamanhos

```jsx
w-full                  // width: 100%
w-64                    // width: 16rem (256px)
h-screen                // height: 100vh
min-h-screen            // min-height: 100vh
max-w-3xl               // max-width: 48rem
```

### Cores

```jsx
bg-white                // background: white
bg-gray-900             // background: cinza muito escuro
text-emerald-500        // color: verde esmeralda
border-gray-200         // border-color: cinza claro
```

### Tipografia

```jsx
text-lg                 // font-size: 1.125rem
text-xl                 // font-size: 1.25rem
font-bold               // font-weight: 700
font-medium             // font-weight: 500
text-center             // text-align: center
```

### Bordas e Sombras

```jsx
rounded-lg              // border-radius: 0.5rem
rounded-full            // border-radius: 9999px (círculo)
shadow-md               // box-shadow média
shadow-lg               // box-shadow grande
border                  // border: 1px solid
```

### Responsividade

```jsx
hidden                  // display: none
lg:block                // desktop: display: block
sm:text-xl              // tablet: font-size: 1.25rem
lg:w-72                 // desktop: width: 18rem
```

### Hover e Transições

```jsx
hover:bg-gray-100       // ao passar mouse: background cinza
transition              // transition: all 0.15s
duration-300            // transition-duration: 300ms
```

---

## 🚀 Conceitos Avançados

### Immutability (Imutabilidade)

**❌ ERRADO (mutável):**
```jsx
const frutas = ['maçã', 'banana']
frutas.push('laranja') // Modifica o array original
setFrutas(frutas) // React pode não detectar mudança
```

**✅ CORRETO (imutável):**
```jsx
const frutas = ['maçã', 'banana']
const novasFrutas = [...frutas, 'laranja'] // Cria novo array
setFrutas(novasFrutas) // React detecta mudança
```

**Por quê?**
React compara referências de objetos. Se você mutar diretamente, a referência permanece a mesma, e React não sabe que mudou.

### Spread Operator (...)

**Com Arrays:**
```jsx
const numeros = [1, 2, 3]
const maisNumeros = [...numeros, 4, 5]
// Resultado: [1, 2, 3, 4, 5]
```

**Com Objetos:**
```jsx
const pessoa = { nome: 'João', idade: 25 }
const pessoaAtualizada = { ...pessoa, idade: 26 }
// Resultado: { nome: 'João', idade: 26 }
```

**Por que usar:**
- Cria cópia (não modifica original)
- Permite "mergear" arrays/objetos
- Mantém imutabilidade

### Template Literals

```jsx
const nome = "João"
const idade = 25

// Jeito antigo:
const mensagem = "Olá, " + nome + "! Você tem " + idade + " anos."

// Jeito moderno:
const mensagem = `Olá, ${nome}! Você tem ${idade} anos.`
```

**Vantagens:**
- Mais legível
- Permite expressões: `${idade + 1}`
- Suporta quebras de linha

### Optional Chaining (?.)

```jsx
const usuario = {
  nome: 'João',
  endereco: {
    rua: 'Rua A',
    numero: 123
  }
}

// Sem optional chaining:
const cep = usuario.endereco && usuario.endereco.cep
// undefined (não dá erro)

// Com optional chaining:
const cep = usuario.endereco?.cep
// undefined (mais limpo)
```

**Quando usar:**
- Dados que podem não existir
- APIs que podem retornar null
- Evita erros "Cannot read property of undefined"

### Destructuring

**Arrays:**
```jsx
const cores = ['vermelho', 'verde', 'azul']

// Sem destructuring:
const primeira = cores[0]
const segunda = cores[1]

// Com destructuring:
const [primeira, segunda] = cores
// primeira = 'vermelho'
// segunda = 'verde'
```

**Objetos:**
```jsx
const pessoa = { nome: 'João', idade: 25, cidade: 'SP' }

// Sem destructuring:
const nome = pessoa.nome
const idade = pessoa.idade

// Com destructuring:
const { nome, idade } = pessoa
```

**Em Props:**
```jsx
// Sem destructuring:
function Componente(props) {
  return <p>{props.nome} - {props.idade}</p>
}

// Com destructuring:
function Componente({ nome, idade }) {
  return <p>{nome} - {idade}</p>
}
```

---

## 🔧 Configurações do Projeto

### tailwind.config.cjs

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}" // Procura classes em todos os arquivos .js e .jsx
  ],
  darkMode: 'class', // Modo escuro via classe CSS
  theme: {
    extend: {
      // Personalizações futuras aqui
    },
  },
  plugins: [],
}
```

**`content`**: Diz ao Tailwind onde procurar classes usadas (para fazer tree-shaking)

**`darkMode: 'class'`**: Ativa modo escuro quando a classe `dark` está no elemento raiz

### postcss.config.cjs

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},      // Processa diretivas @tailwind
    autoprefixer: {},     // Adiciona prefixos de navegador automaticamente
  },
}
```

**Autoprefixer:**
Transforma:
```css
display: flex;
```

Em:
```css
display: -webkit-box;
display: -ms-flexbox;
display: flex;
```

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // Habilita Fast Refresh do React
})
```

**Fast Refresh:**
- Mantém estado dos componentes ao editar código
- Atualização instantânea no navegador
- Não perde dados de formulários ao editar

---

## 📚 Glossário

**Component**: Peça reutilizável de UI (como LEGO)

**State**: Memória do componente (dados que mudam)

**Props**: Informações passadas de pai para filho

**Hook**: Função especial do React (useState, useEffect, etc.)

**JSX**: Sintaxe que parece HTML mas é JavaScript

**Render**: Processo de React criar/atualizar a UI

**Virtual DOM**: Cópia em memória do DOM real (mais rápido)

**Lifecycle**: Ciclo de vida do componente (mount, update, unmount)

**Event Handler**: Função que responde a eventos (click, change, etc.)

**Controlled Component**: Input cujo valor vem do estado React

**Conditional Rendering**: Mostrar/esconder elementos baseado em condição

**Key**: Identificador único para elementos em listas

**Immutability**: Não mutar dados diretamente (criar cópias)

**Tree Shaking**: Remover código não usado do bundle final

**Hot Module Replacement**: Atualizar módulos sem reload completo

---

## 🎓 Conclusão

Este projeto demonstra:

✅ **React Moderno**: Hooks, componentes funcionais  
✅ **UI Responsiva**: Desktop, tablet e mobile  
✅ **Estado Gerenciado**: Lifting state, prop drilling  
✅ **Boas Práticas**: Código limpo, componentização  
✅ **Performance**: Build otimizado com Vite  
✅ **UX Moderna**: Loading states, toasts, modais  

**Próximos passos para expandir:**

1. Conectar com backend (API)
2. Autenticação de usuários
3. Persistência de dados (localStorage ou banco)
4. Testes automatizados
5. Deploy em produção

---

**Happy Coding! 🚀**
