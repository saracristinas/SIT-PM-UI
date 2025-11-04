import React, { useState } from 'react';
import { Send, Bot, User, MessageSquare, Plus, Menu, X, Sparkles, AlertCircle, Trash2, Lightbulb, Calendar } from 'lucide-react';

export default function TriagemIA({ darkMode = false }) {
  const [symptoms, setSymptoms] = useState('');
  const [activeTriagemId, setActiveTriagemId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTriagensSidebar, setShowTriagensSidebar] = useState(false);
  const [triagens, setTriagens] = useState([]);

  const activeTriagem = triagens.find(t => t.id === activeTriagemId);

  const handleNovaTriagem = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newId = triagens.length > 0 ? Math.max(...triagens.map(t => t.id)) + 1 : 1;
    
    const newTriagem = {
      id: newId,
      title: 'Triagem em andamento',
      date: `${dateStr} ${timeStr}`,
      severity: 'MÉDIA',
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Olá! 👋 Sou a assistente virtual do MediCenter. Estou aqui para entender melhor seus sintomas e ajudá-lo(a) a receber o atendimento adequado.\n\nPara começar, pode me contar o que está sentindo?',
          time: timeStr
        }
      ]
    };
    
    setTriagens([newTriagem, ...triagens]);
    setActiveTriagemId(newId);
    setSymptoms('');
  };

  const handleDeleteTriagem = (id, e) => {
    e.stopPropagation();
    const updatedTriagens = triagens.filter(t => t.id !== id);
    setTriagens(updatedTriagens);
    if (activeTriagemId === id) {
      setActiveTriagemId(null);
    }
  };

  const handleSendMessage = () => {
    if (!symptoms.trim() || !activeTriagem) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newUserMessage = {
      id: activeTriagem.messages.length + 1,
      type: 'user',
      text: symptoms,
      time: timeStr
    };

    // Atualiza o título da triagem com a primeira mensagem do usuário
    const updatedTitle = activeTriagem.messages.length === 1 
      ? (symptoms.length > 30 ? symptoms.substring(0, 30) + '...' : symptoms)
      : activeTriagem.title;

    setTriagens(triagens.map(t => 
      t.id === activeTriagemId 
        ? { ...t, title: updatedTitle, messages: [...t.messages, newUserMessage] }
        : t
    ));

    setSymptoms('');
    setIsTyping(true);

    // Simula resposta do bot
    setTimeout(() => {
      const botResponse = {
        id: activeTriagem.messages.length + 2,
        type: 'bot',
        text: 'Entendo. Pode me dizer há quanto tempo você está sentindo isso? E a intensidade da dor é leve, moderada ou forte?',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setTriagens(prev => prev.map(t => 
        t.id === activeTriagemId 
          ? { ...t, messages: [...t.messages, botResponse] }
          : t
      ));

      setIsTyping(false);
    }, 1500);
  };

  const handleFecharChat = () => {
    setActiveTriagemId(null);
    setSymptoms('');
  };

  return (
    <div className={`flex h-screen p-4 sm:p-6 lg:p-8 gap-4 lg:gap-6 ${darkMode ? 'bg-gray-900' : 'bg-[#EFFDF9]'}`}>
      {/* Container Principal - Conteúdo da Esquerda */}
      <div className={`flex-1 rounded-2xl overflow-hidden shadow-xl border lg:h-[calc(100vh-4rem)] ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        {/* Área Principal - Conteúdo Central */}
        <div className="flex flex-col h-full">
        
          {/* Conteúdo - Tela Inicial ou Chat */}
          {!activeTriagemId ? (
            // Tela Inicial
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {/* Header */}
              <div className="mb-6 sm:mb-8 text-center sm:text-left w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Triagem Inteligente
                  </h1>
                </div>
                <p className={`text-xs sm:text-sm lg:text-base text-center sm:text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Converse com nossa IA e obtenha orientação médica personalizada
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4">
              {/* Ícone Central */}
              <div className="mb-6 sm:mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                  <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>

              {/* Texto Central */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Como está se sentindo hoje?
                </h2>
                <p className={`text-sm sm:text-base lg:text-lg max-w-xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Nossa IA médica irá fazer perguntas sobre seus sintomas para entender melhor seu caso e conectá-lo com o especialista adequado.
                </p>
              </div>

              {/* Botão Iniciar */}
              <button
                onClick={handleNovaTriagem}
                className="mb-8 sm:mb-12 px-5 py-2.5 sm:px-6 sm:py-3 text-white rounded-lg font-semibold transition-all shadow-md flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
                style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}
              >
                <MessageSquare className="w-5 h-5" />
                Iniciar Triagem
              </button>

              {/* Cards de Recursos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl">
                <div className={`rounded-xl p-4 sm:p-6 text-center ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50'}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                    <MessageSquare className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-blue-200' : 'text-gray-900'}`}>
                    Perguntas Personalizadas
                  </p>
                </div>

                <div className={`rounded-xl p-4 sm:p-6 text-center ${darkMode ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50'}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 ${darkMode ? 'bg-purple-800' : 'bg-purple-100'}`}>
                    <Lightbulb className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-purple-200' : 'text-gray-900'}`}>
                    Orientações Inteligentes
                  </p>
                </div>

                <div className={`rounded-xl p-4 sm:p-6 text-center ${darkMode ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-emerald-50'}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 ${darkMode ? 'bg-emerald-800' : 'bg-emerald-100'}`}>
                    <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-gray-900'}`}>
                    Agendamento Rápido
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Interface de Chat
          <div className="flex-1 flex flex-col h-full">
            {/* Header do Chat */}
            <div className={`border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className={`font-bold text-base sm:text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assistente de Triagem</h2>
                  <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="hidden sm:inline">Online • Respondendo em tempo real</span>
                    <span className="sm:hidden">Online</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Botão para abrir triagens anteriores - MOBILE */}
                <button
                  onClick={() => setShowTriagensSidebar(true)}
                  className={`lg:hidden p-2 rounded-lg transition ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={handleFecharChat}
                  className={`px-3 py-2 sm:px-4 rounded-lg transition font-medium text-sm ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className={`flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
                {activeTriagem?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${
                        message.type === 'bot'
                          ? darkMode ? 'bg-gray-800 text-gray-100 shadow-sm border border-gray-700' : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                          : 'text-white shadow-sm'
                      }`}
                      style={message.type === 'user' ? { backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' } : {}}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.type === 'bot' ? (darkMode ? 'text-gray-500' : 'text-gray-400') : 'text-white/70'}`}>
                        {message.time}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        <User className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicador de digitação */}
                {isTyping && (
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className={`rounded-2xl px-4 py-3 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className={`border-t px-3 sm:px-6 py-3 sm:py-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3 items-end">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 placeholder-gray-400 focus:outline-none focus:ring-2 transition resize-none text-sm sm:text-base ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-900' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-400 focus:ring-blue-100'
                  }`}
                />
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!symptoms.trim()}
                  className={`p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-center ${
                    symptoms.trim()
                      ? 'text-white shadow-md hover:shadow-lg'
                      : (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400') + ' cursor-not-allowed'
                  }`}
                  style={symptoms.trim() ? { backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' } : {}}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Sidebar Direita - Triagens Anteriores */}
      <div className={`
        ${showTriagensSidebar ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        right-0 lg:right-auto
        top-0 lg:top-auto
        bottom-0 lg:bottom-auto
        h-full lg:h-[calc(100vh-4rem)]
        w-[85%] sm:w-96
        lg:w-80 xl:w-96
        rounded-l-2xl lg:rounded-2xl
        shadow-2xl border-l lg:border
        flex flex-col
        overflow-hidden
        transition-transform duration-300
        z-50 lg:z-0
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        
          {/* Header da Sidebar */}
        <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-lg sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Triagens Anteriores
            </h2>
            {/* Botão fechar - apenas mobile */}
            <button
              onClick={() => setShowTriagensSidebar(false)}
              className={`lg:hidden p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Triagens */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
          {triagens.length === 0 ? (
            // Mensagem quando não há triagens
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <MessageSquare className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <p className={`text-sm font-medium text-center mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nenhuma triagem por aqui
              </p>
              <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Clique em "Iniciar Triagem" para começar
              </p>
            </div>
          ) : (
            triagens.map((triagem) => (
              <button
                key={triagem.id}
                onClick={() => {
                  setActiveTriagemId(triagem.id);
                  setShowTriagensSidebar(false);
                }}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all text-sm ${
                  triagem.id === activeTriagemId
                    ? darkMode ? 'border-blue-400 bg-blue-900/30 shadow-md' : 'border-blue-300 bg-blue-50 shadow-md'
                    : darkMode ? 'border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className={`font-semibold text-xs sm:text-sm line-clamp-1 flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {triagem.title}
                  </p>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded flex-shrink-0">
                    {triagem.severity}
                  </span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {triagem.date}
                </p>
                <button
                  onClick={(e) => handleDeleteTriagem(triagem.id, e)}
                  className={`mt-2 text-xs transition ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                >
                  Excluir
                </button>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Botão flutuante para abrir triagens - Mobile - Apenas na tela inicial */}
      {!activeTriagemId && (
        <button
          onClick={() => setShowTriagensSidebar(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition hover:shadow-xl"
          style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Overlay mobile */}
      {showTriagensSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowTriagensSidebar(false)}
        />
      )}
    </div>
  );
}