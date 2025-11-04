import React, { useState } from 'react';
import { Send, Bot, User, MessageSquare, Plus, Menu, X, Sparkles, AlertCircle, Trash2 } from 'lucide-react';

export default function TriagemIA() {
  const [darkMode, setDarkMode] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [activeTriagemId, setActiveTriagemId] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [showTriagensSidebar, setShowTriagensSidebar] = useState(false);
  const [triagens, setTriagens] = useState([
    {
      id: 1,
      title: 'Triagem - 02/11/2025, 23:2...',
      date: '03 de nov., 02:22',
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! 👋 Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.'
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
          text: 'Olá! 👋 Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.'
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
          text: 'Olá! 👋 Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.'
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
          text: 'Olá! 👋 Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.'
        }
      ]
    }
  ]);

  const activeTriagem = triagens.find(t => t.id === activeTriagemId);

  const handleNovaTriagem = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newId = Math.max(...triagens.map(t => t.id)) + 1;
    
    const newTriagem = {
      id: newId,
      title: `Triagem - ${now.toLocaleDateString('pt-BR')}, ${timeStr}...`,
      date: `${dateStr}, ${timeStr}`,
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! 👋 Sou seu assistente de triagem médica. Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial.'
        }
      ]
    };
    
    setTriagens([newTriagem, ...triagens]);
    setActiveTriagemId(newId);
    setShowTriagensSidebar(false);
  };

  const handleDeleteTriagem = (id, e) => {
    e.stopPropagation();
    
    const updatedTriagens = triagens.filter(t => t.id !== id);
    setTriagens(updatedTriagens);
    
    // Se deletou a conversa ativa e ainda há outras, seleciona a primeira
    if (activeTriagemId === id && updatedTriagens.length > 0) {
      setActiveTriagemId(updatedTriagens[0].id);
    }
  };

  const handleSendMessage = () => {
    if (!symptoms.trim()) return;

    const newUserMessage = {
      id: activeTriagem.messages.length + 1,
      type: 'user',
      text: symptoms
    };

    setTriagens(triagens.map(t => 
      t.id === activeTriagemId 
        ? { ...t, messages: [...t.messages, newUserMessage] }
        : t
    ));

    setSymptoms('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: activeTriagem.messages.length + 2,
        type: 'bot',
        text: 'Entendo seus sintomas. Com base nas informações fornecidas, recomendo que você consulte um médico para uma avaliação mais detalhada. Posso ajudá-lo a agendar uma consulta? 🩺'
      };

      setTriagens(prev => prev.map(t => 
        t.id === activeTriagemId 
          ? { ...t, messages: [...t.messages, botResponse] }
          : t
      ));

      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50'}`}>
      {/* Overlay para mobile */}
      {showTriagensSidebar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowTriagensSidebar(false)}
        />
      )}

      {/* Sidebar - Histórico de Triagens */}
      <div className={`${
        showTriagensSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-50 lg:z-0 w-80 h-full ${
        darkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-xl border-r ${
        darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
      } flex flex-col shadow-2xl transition-transform duration-300`}>
        
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Triagens
                </h2>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {triagens.length} conversa(s)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTriagensSidebar(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button 
            onClick={handleNovaTriagem}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Nova Triagem
          </button>
        </div>

        {/* Título do Histórico */}
        <div className="px-6 py-3 pt-4">
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Histórico de Triagens
          </h3>
        </div>

        {/* Lista de Triagens */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pt-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {triagens.map((triagem) => (
            <button
              key={triagem.id}
              onClick={() => {
                setActiveTriagemId(triagem.id);
                setShowTriagensSidebar(false);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                triagem.id === activeTriagemId
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-500'
                  : darkMode
                  ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700 hover:border-gray-500'
                  : 'bg-gray-50/50 border-gray-200/50 hover:bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  triagem.id === activeTriagemId 
                    ? 'bg-emerald-500' 
                    : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <MessageSquare className={`w-5 h-5 transition-colors ${
                    triagem.id === activeTriagemId 
                      ? 'text-white' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${
                    triagem.id === activeTriagemId 
                      ? 'text-emerald-900' 
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {triagem.title}
                  </p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${
                    triagem.id === activeTriagemId 
                      ? 'text-emerald-700' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {triagem.date}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteTriagem(triagem.id, e)}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    darkMode 
                      ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                      : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                  }`}
                  title="Excluir triagem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Área Principal - Chat */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Header com Gradiente */}
        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white px-4 sm:px-6 lg:px-8 py-6 shadow-xl">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTriagensSidebar(!showTriagensSidebar)}
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-white/10 transition backdrop-blur-sm"
              >
                {showTriagensSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold truncate flex items-center gap-2">
                  Assistente de Triagem Médica
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </h1>
                <p className="text-emerald-50 text-sm sm:text-base mt-1">
                  Descreva seus sintomas para uma avaliação inicial inteligente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {triagens.length === 0 ? (
              /* Tela quando não há triagens */
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <Bot className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                  </div>
                </div>
                
                <div className={`text-center space-y-4 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Bem-vindo à Triagem Inteligente
                  </h2>
                  <p className={`text-base sm:text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Nosso assistente de IA está pronto para analisar seus sintomas e orientar sobre os próximos passos.
                  </p>
                  
                  <button 
                    onClick={handleNovaTriagem}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Iniciar Nova Triagem
                  </button>
                </div>
              </div>
            ) : activeTriagem?.messages.length === 1 ? (
              /* Mensagem de Boas-vindas */
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform hover:scale-105 transition">
                    <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                </div>
                
                <div className={`text-center space-y-4 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Olá! 👋 Sou seu assistente de triagem médica.
                  </h2>
                  <p className={`text-base sm:text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Por favor, descreva seus sintomas em detalhes e vou ajudá-lo com uma avaliação inicial inteligente e personalizada.
                  </p>
                  
                  <div className={`mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto`}>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="text-3xl mb-2">🩺</div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Avaliação rápida
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="text-3xl mb-2">⚡</div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        24/7 disponível
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="text-3xl mb-2">🤖</div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        IA avançada
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat de Mensagens */
              <>
                {activeTriagem?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 sm:gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] sm:max-w-2xl rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base shadow-lg ${
                        message.type === 'bot'
                          ? darkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-750 text-gray-100 border border-gray-700'
                            : 'bg-white text-gray-900 border border-gray-100'
                          : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30'
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicador de "digitando" */}
                {isTyping && (
                  <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className={`rounded-2xl px-5 py-4 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Input de Mensagem - Design Moderno */}
        <div className={`flex-shrink-0 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-2xl`}>
          <div className="max-w-4xl mx-auto">
            {triagens.length === 0 ? (
              <div className="text-center py-4">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Clique em "Iniciar Nova Triagem" para começar
                </p>
              </div>
            ) : (
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Descreva seus sintomas detalhadamente... (ex: febre há 2 dias, dor de cabeça intensa)"
                  rows={2}
                  className={`w-full px-4 sm:px-5 lg:px-4 py-2.5 sm:py-3 lg:py-2.5 rounded-2xl lg:rounded-xl border-2 text-sm sm:text-base lg:text-sm resize-none ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                  } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition shadow-inner`}
                />
              </div>
              
              <button 
                onClick={handleSendMessage}
                disabled={!symptoms.trim()}
                className={`px-3 sm:px-4 lg:px-4 py-3 sm:py-3.5 lg:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm lg:text-sm flex-shrink-0 shadow-md ${
                  symptoms.trim()
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline lg:inline">Enviar</span>
              </button>
            </div>
            )}
            
            {/* Mensagem Informativa */}
            {triagens.length > 0 && (
            <p className={`text-xs text-center mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center justify-center gap-1.5`}>
              💡 A triagem por IA não substitui uma consulta médica profissional
            </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}