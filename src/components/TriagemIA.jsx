import React, { useState } from 'react'
import { Send, Bot, User, MessageSquare, Plus, Menu, X } from 'lucide-react'

export default function TriagemIA({ darkMode }) {
  const [symptoms, setSymptoms] = useState('')
  const [activeTriagemId, setActiveTriagemId] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
  const [showTriagensSidebar, setShowTriagensSidebar] = useState(false)
  const [triagens, setTriagens] = useState([
    {
      id: 1,
      title: 'Triagem - 02/11/2025, 23:2...',
      date: '03 de nov., 02:22',
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes.'
        }
      ]
    },
    {
      id: 2,
      title: 'Triagem - 03/11/2025, 13:2...',
      date: '03 de nov., 16:28',
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes.'
        }
      ]
    },
    {
      id: 3,
      title: 'Triagem - 03/11/2025, 14:3...',
      date: '03 de nov., 17:37',
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes.'
        }
      ]
    },
    {
      id: 4,
      title: 'Triagem - 03/11/2025, 16:5...',
      date: '03 de nov., 19:51',
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes.'
        }
      ]
    }
  ])

  const activeTriagem = triagens.find(t => t.id === activeTriagemId)

  const handleNovaTriagem = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const newId = Math.max(...triagens.map(t => t.id)) + 1
    
    const newTriagem = {
      id: newId,
      title: `Triagem - ${now.toLocaleDateString('pt-BR')}, ${timeStr}...`,
      date: `${dateStr}, ${timeStr}`,
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes.'
        }
      ]
    }
    
    setTriagens([newTriagem, ...triagens])
    setActiveTriagemId(newId)
    setShowTriagensSidebar(false)
  }

  const handleSendMessage = () => {
    if (!symptoms.trim()) return

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

    setSymptoms('')
    setIsTyping(true)

    // Simula bot digitando
    setTimeout(() => {
      const botResponse = {
        id: activeTriagem.messages.length + 2,
        type: 'bot',
        text: 'Entendo seus sintomas. Com base nas informações fornecidas, recomendo que você consulte um médico para uma avaliação mais detalhada. Posso ajudá-lo a agendar uma consulta?'
      }

      setTriagens(prev => prev.map(t => 
        t.id === activeTriagemId 
          ? { ...t, messages: [...t.messages, botResponse] }
          : t
      ))

      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay Mobile - Sidebar Triagens */}
      {showTriagensSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowTriagensSidebar(false)}
        />
      )}

      {/* Sidebar Lateral - Histórico de Triagens */}
      <div className={`${
        showTriagensSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-50 lg:z-0 w-64 h-full ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r flex flex-col transition-transform duration-300`}>
        
        {/* Botão Nova Triagem */}
        <div className="p-4">
          <button 
            onClick={handleNovaTriagem}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Triagem
          </button>
        </div>

        {/* Título do Histórico */}
        <div className="px-4 pb-3">
          <h3 className={`text-xs font-semibold uppercase ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Histórico de Triagens
          </h3>
        </div>

        {/* Lista de Triagens */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
          {triagens.map((triagem) => (
            <button
              key={triagem.id}
              onClick={() => {
                setActiveTriagemId(triagem.id)
                setShowTriagensSidebar(false)
              }}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                triagem.id === activeTriagemId
                  ? 'bg-emerald-50 border-emerald-500'
                  : darkMode
                  ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  triagem.id === activeTriagemId 
                    ? 'text-emerald-600' 
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${
                    triagem.id === activeTriagemId 
                      ? 'text-emerald-900' 
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {triagem.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    triagem.id === activeTriagemId 
                      ? 'text-emerald-700' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {triagem.date}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Área Principal - Chat */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Header Verde */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-6 sm:py-8 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTriagensSidebar(!showTriagensSidebar)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition"
            >
              {showTriagensSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Bot className="w-10 h-10 sm:w-12 sm:h-12" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Assistente de Triagem Médica</h1>
              <p className="text-emerald-50 text-sm sm:text-base mt-1">
                Descreva seus sintomas para uma avaliação inicial inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8`}>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {activeTriagem?.messages.length === 1 ? (
              /* Mensagem de Boas-vindas */
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </div>
                <h2 className={`text-lg sm:text-xl font-bold mb-2 text-center px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Olá! 👋 Sou seu assistente de triagem médica.
                </h2>
                <p className={`text-sm sm:text-base text-center max-w-md px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.
                </p>
              </div>
            ) : (
              /* Chat de Mensagens */
              <>
                {activeTriagem?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-2xl rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${
                        message.type === 'bot'
                          ? darkMode
                            ? 'bg-gray-800 text-gray-100'
                            : 'bg-white text-gray-900'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicador de "digitando" */}
                {isTyping && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className={`rounded-lg px-4 py-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Input de Mensagem - Fixo no Rodapé */}
        <div className={`flex-shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-2 sm:py-3`}>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite seus sintomas..."
                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border text-sm sm:text-base ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
              <button 
                onClick={handleSendMessage}
                className="px-4 sm:px-5 py-2 sm:py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition flex items-center gap-2 text-sm sm:text-base flex-shrink-0"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
            <p className={`text-xs mt-1.5 text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              💡 A triagem por IA não substitui uma consulta médica profissional
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
