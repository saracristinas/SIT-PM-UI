import React, { useState } from 'react'
import { Send, Bot, MessageSquare, Plus, User } from 'lucide-react'

export default function TriagemIA({ darkMode }) {
  const [symptoms, setSymptoms] = useState('')
  const [activeTriagemId, setActiveTriagemId] = useState(1)
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
  }

  const handleSendMessage = () => {
    if (!symptoms.trim()) return

    const newUserMessage = {
      id: activeTriagem.messages.length + 1,
      type: 'user',
      text: symptoms
    }

    const botResponse = {
      id: activeTriagem.messages.length + 2,
      type: 'bot',
      text: 'Entendo seus sintomas. Com base nas informações fornecidas, recomendo que você consulte um médico para uma avaliação mais detalhada. Posso ajudá-lo a agendar uma consulta?'
    }

    setTriagens(triagens.map(t => 
      t.id === activeTriagemId 
        ? { ...t, messages: [...t.messages, newUserMessage, botResponse] }
        : t
    ))

    setSymptoms('')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Esquerda - Histórico de Triagens */}
      <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
        <div className="p-4">
          <button 
            onClick={handleNovaTriagem}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
          >
            <Plus className="w-5 h-5" />
            Nova Triagem
          </button>
        </div>

        <div className="px-4 pb-3">
          <h3 className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            HISTÓRICO DE TRIAGENS
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {triagens.map((triagem) => (
            <button
              key={triagem.id}
              onClick={() => setActiveTriagemId(triagem.id)}
              className={`w-full text-left p-4 rounded-lg border ${
                triagem.id === activeTriagemId
                  ? 'bg-emerald-50 border-emerald-500'
                  : darkMode
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } transition`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className={`w-5 h-5 flex-shrink-0 ${triagem.id === activeTriagemId ? 'text-emerald-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${triagem.id === activeTriagemId ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {triagem.title}
                  </p>
                  <p className={`text-xs mt-1 ${triagem.id === activeTriagemId ? 'text-emerald-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {triagem.date}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Área Principal - Chat do Assistente */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-8 py-6`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Assistente de Triagem Médica ⚙️
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Descreva seus sintomas para uma avaliação inicial inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto px-8 py-8`}>
          <div className="max-w-3xl mx-auto space-y-6">
            {activeTriagem?.messages.length === 1 ? (
              /* Mensagem de Boas-vindas */
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Olá! 👋 Sou seu assistente de triagem médica.
                </h2>
                <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.
                </p>
              </div>
            ) : (
              /* Chat de Mensagens */
              activeTriagem?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-3 ${
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
              ))
            )}
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-8 py-6`}>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite seus sintomas aqui... (ex: dor de cabeça, febre...)"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
              <button 
                onClick={handleSendMessage}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar
              </button>
            </div>
            <p className={`text-xs mt-3 text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              💡 A triagem por IA não substitui uma consulta médica profissional
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
