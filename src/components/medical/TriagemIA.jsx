import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, Plus, Menu, X, Sparkles, AlertCircle, Trash2, Lightbulb, Calendar } from 'lucide-react';
import { sendMessageToGemini, startTriagem, analyzeSymptomSeverity, detectarIntencaoAgendamento } from '../../services/gemini';
import { enviarEmailConsultaAgendada } from '../../services/emailService';
import CalendarioAgendamento from '../scheduling/CalendarioAgendamento';

export default function TriagemIA({ darkMode = false, onAgendarConsulta }) {
  const [symptoms, setSymptoms] = useState('');
  const [activeTriagemId, setActiveTriagemId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showTriagensSidebar, setShowTriagensSidebar] = useState(false);
  const [triagens, setTriagens] = useState([]);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [especialidadeRecomendada, setEspecialidadeRecomendada] = useState(null);
  const messagesEndRef = useRef(null);

  const activeTriagem = triagens.find(t => t.id === activeTriagemId);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTriagem?.messages, isTyping]);

  const handleNovaTriagem = async () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newId = triagens.length > 0 ? Math.max(...triagens.map(t => t.id)) + 1 : 1;
    
    // Obtém mensagem inicial da IA
    setIsTyping(true);
    let initialMessage;
    try {
      initialMessage = await startTriagem();
    } catch (error) {
      console.error('Erro ao iniciar triagem:', error);
      initialMessage = 'Olá! 👋 Sou a assistente virtual do MediCenter. Para começar, qual é o seu sintoma predominante? (Ex: dor de cabeça, febre, dor abdominal, etc.)';
    }
    setIsTyping(false);
    
    const newTriagem = {
      id: newId,
      title: 'Nova triagem',
      date: `${dateStr} ${timeStr}`,
      status: 'EM_ANDAMENTO',
      severity: null,
      messages: [
        {
          id: 1,
          type: 'bot',
          text: initialMessage,
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

  // Função para finalizar triagem e definir a gravidade
  const handleFinalizarTriagem = (id, severity) => {
    setTriagens(triagens.map(t => 
      t.id === id 
        ? { ...t, status: 'FINALIZADA', severity: severity }
        : t
    ));
  };

  // Detecta se a IA está recomendando agendamento de consulta
  const detectarRecomendacaoEspecialidade = (textoIA) => {
    const especialidades = ['Neurologia', 'Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria', 'Ginecologia', 'Clínico Geral', 'Psiquiatria', 'neurologista', 'cardiologista', 'dermatologista'];
    
    // Procura padrões que indicam recomendação de especialidade
    const padroes = [
      /especialidade mais indicada.*?(?:é|seria).*?\*\*([^\*]+)\*\*/i,
      /recomendo.*?consulta.*?com.*?\*\*([^\*]+)\*\*/i,
      /sugiro.*?agendar.*?com.*?\*\*([^\*]+)\*\*/i,
      /encaminhamento.*?para.*?\*\*([^\*]+)\*\*/i,
      /agendar.*?consulta.*?com.*?um\s+(\w+)/i,
      /consulta.*?com.*?um\s+(\w+)/i,
      /neurologista|cardiologista|dermatologista|ortopedista/i
    ];

    for (const padrao of padroes) {
      const match = textoIA.match(padrao);
      if (match) {
        let especialidade = match[1] ? match[1].trim() : match[0].trim();
        
        // Converte para nome da especialidade
        if (especialidade.toLowerCase().includes('neurolog')) return 'Neurologia';
        if (especialidade.toLowerCase().includes('cardio')) return 'Cardiologia';
        if (especialidade.toLowerCase().includes('dermato')) return 'Dermatologia';
        if (especialidade.toLowerCase().includes('ortoped')) return 'Ortopedia';
        if (especialidade.toLowerCase().includes('pediatr')) return 'Pediatria';
        if (especialidade.toLowerCase().includes('gineco')) return 'Ginecologia';
        if (especialidade.toLowerCase().includes('psiquiatr')) return 'Psiquiatria';
        
        return especialidade;
      }
    }

    // Verifica se há menção de especialidade em qualquer parte do texto
    const textoLower = textoIA.toLowerCase();
    if (textoLower.includes('neurolog')) return 'Neurologia';
    if (textoLower.includes('cardio')) return 'Cardiologia';
    if (textoLower.includes('dermato')) return 'Dermatologia';
    if (textoLower.includes('ortoped')) return 'Ortopedia';
    if (textoLower.includes('pediatr')) return 'Pediatria';
    if (textoLower.includes('gineco')) return 'Ginecologia';
    if (textoLower.includes('psiquiatr')) return 'Psiquiatria';
    if (textoLower.includes('clínico geral')) return 'Clínico Geral';

    return null;
  };

  // Função para quando usuário quer agendar
  const handleQueroAgendar = () => {
    setMostrarCalendario(true);
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const confirmacaoMessage = {
      id: activeTriagem.messages.length + 1,
      type: 'user',
      text: 'Sim, gostaria de agendar uma consulta.',
      time: timeStr
    };

    setTriagens(prev => prev.map(t => 
      t.id === activeTriagemId 
        ? { ...t, messages: [...t.messages, confirmacaoMessage] }
        : t
    ));
  };

  // Função quando consulta é agendada
  const handleAgendarConsulta = async (dadosConsulta) => {
    try {
      // Busca dados do usuário do localStorage
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        console.error('Usuário não encontrado');
        return;
      }

      const userData = JSON.parse(userDataString);

      // Nome da clínica
      const nomeClinica = 'MediCenter';

      // Cria objeto de consulta no formato esperado
      const novaConsulta = {
        id: Date.now(), // ID único baseado em timestamp
        dataHora: `${dadosConsulta.data}T${dadosConsulta.hora}`,
        tipo: 'presencial',
        medico: `Médico de ${dadosConsulta.especialidade}`, // Mock - em produção viria do backend
        especialidade: dadosConsulta.especialidade,
        crm: 'A definir',
        motivo: activeTriagem?.title || 'Consulta agendada via triagem',
        status: 'agendada',
        local: `${nomeClinica} - A definir`
      };

      // Salva a consulta usando a função do App.jsx
      if (onAgendarConsulta) {
        onAgendarConsulta(novaConsulta);
        console.log('✅ Consulta salva com sucesso!');
      }

      // Envia o email de confirmação com o nome da clínica
      const sucesso = await enviarEmailConsultaAgendada(userData, dadosConsulta, nomeClinica);

      if (sucesso) {
        console.log('✅ Email de confirmação enviado com sucesso!');
      }

      // Finaliza a triagem
      handleFinalizarTriagem(activeTriagemId, 'AGENDADA');
      
      // Fecha o calendário após 5 segundos
      setTimeout(() => {
        setMostrarCalendario(false);
        setEspecialidadeRecomendada(null);
      }, 5000);

    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!symptoms.trim() || !activeTriagem) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const userInput = symptoms.trim();

    // 🔍 DETECTA INTENÇÃO DE AGENDAMENTO LOGO NO INÍCIO
    const querAgendar = detectarIntencaoAgendamento(userInput);
    
    if (querAgendar) {
      console.log('📅 Detectada intenção de agendamento!');
      
      const newUserMessage = {
        id: activeTriagem.messages.length + 1,
        type: 'user',
        text: userInput,
        time: timeStr
      };

      const botResponse = {
        id: activeTriagem.messages.length + 2,
        type: 'bot',
        text: 'Perfeito! Vou abrir o calendário para você escolher a melhor data e horário para sua consulta. 📅',
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setTriagens(prev => prev.map(t => 
        t.id === activeTriagemId 
          ? { ...t, messages: [...t.messages, newUserMessage, botResponse] }
          : t
      ));

      setSymptoms('');
      
      // Aguarda um pouco para mostrar a mensagem, depois abre o calendário
      setTimeout(() => {
        setMostrarCalendario(true);
        setEspecialidadeRecomendada('Clínico Geral'); // Define especialidade padrão
      }, 1000);
      
      return; // Não precisa chamar a IA
    }

    const newUserMessage = {
      id: activeTriagem.messages.length + 1,
      type: 'user',
      text: userInput,
      time: timeStr
    };

    // A primeira mensagem do usuário define o título (sintoma predominante)
    const isFirstMessage = activeTriagem.messages.length === 1;
    const updatedTitle = isFirstMessage 
      ? symptoms.trim()
      : activeTriagem.title;

    setTriagens(triagens.map(t => 
      t.id === activeTriagemId 
        ? { ...t, title: updatedTitle, messages: [...t.messages, newUserMessage] }
        : t
    ));
    
    // DETECTA SE USUÁRIO ESTÁ CONFIRMANDO AGENDAMENTO
    const respostasPositivas = ['sim', 'yes', 'quero', 'gostaria', 'claro', 'com certeza', 'pode agendar'];
    const usuarioQuerAgendar = respostasPositivas.some(resp => userInput.toLowerCase().includes(resp));
    
    // Se há especialidade recomendada E usuário confirma, mostra calendário
    if (especialidadeRecomendada && usuarioQuerAgendar) {
      setSymptoms('');
      setMostrarCalendario(true);
      console.log('📅 Mostrando calendário para agendamento');
      return; // Não precisa chamar a IA
    }
    
    setSymptoms('');
    setIsTyping(true);

    try {
      console.log('📤 Preparando mensagem para IA...');
      
      // Converte mensagens para o formato da OpenAI
      const conversationHistory = activeTriagem.messages
        .filter(msg => msg.type !== 'bot' || msg.id !== 1) // Remove primeira msg do bot
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
      
      // Adiciona a nova mensagem do usuário
      conversationHistory.push({
        role: 'user',
        content: userInput
      });

      console.log('📝 Histórico da conversa:', conversationHistory);

      // Obtém resposta da IA (Gemini)
      const aiResponse = await sendMessageToGemini(conversationHistory);
      
      console.log('✅ Resposta da IA recebida:', aiResponse);

      const botResponse = {
        id: activeTriagem.messages.length + 2,
        type: 'bot',
        text: aiResponse,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setTriagens(prev => prev.map(t => 
        t.id === activeTriagemId 
          ? { ...t, messages: [...t.messages, botResponse] }
          : t
      ));

      // Detecta se a IA recomendou uma especialidade
      const especialidade = detectarRecomendacaoEspecialidade(aiResponse);
      if (especialidade && !especialidadeRecomendada) {
        setEspecialidadeRecomendada(especialidade);
        console.log('🩺 Especialidade detectada:', especialidade);
      }

      // Após 5+ mensagens, pode analisar gravidade automaticamente
      if (activeTriagem.messages.length >= 8 && activeTriagem.status === 'EM_ANDAMENTO') {
        const fullConversation = [...activeTriagem.messages, newUserMessage, botResponse]
          .map(m => m.text)
          .join(' ');
        
        const severity = analyzeSymptomSeverity(fullConversation);
        console.log('🔍 Gravidade analisada:', severity);
        
        // Pode descomentar para finalizar automaticamente:
        // handleFinalizarTriagem(activeTriagemId, severity);
      }

    } catch (error) {
      console.error('❌ ERRO COMPLETO:', error);
      console.error('❌ Tipo do erro:', error.name);
      console.error('❌ Mensagem:', error.message);
      console.error('❌ Stack:', error.stack);
      
      // Fallback em caso de erro
      const fallbackResponse = {
        id: activeTriagem.messages.length + 2,
        type: 'bot',
        text: `Desculpe, tive um problema ao processar sua mensagem. Erro: ${error.message}. Pode tentar novamente?`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setTriagens(prev => prev.map(t => 
        t.id === activeTriagemId 
          ? { ...t, messages: [...t.messages, fallbackResponse] }
          : t
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleFecharChat = () => {
    setActiveTriagemId(null);
    setSymptoms('');
  };

  return (
    <div className={`flex h-screen overflow-hidden p-2 sm:p-4 lg:p-8 gap-2 sm:gap-4 lg:gap-6 ${darkMode ? 'bg-gray-900' : 'bg-[#EFFDF9]'}`}>
      {/* Container Principal - Conteúdo da Esquerda */}
      <div className={`flex-1 rounded-xl lg:rounded-2xl overflow-hidden shadow-xl border h-full ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        {/* Área Principal - Conteúdo Central */}
        <div className="flex flex-col h-full">
        
          {/* Conteúdo - Tela Inicial ou Chat */}
          {!activeTriagemId ? (
            // Tela Inicial
            <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
              {/* Header */}
              <div className="mb-4 sm:mb-8 text-center w-full max-w-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h1 className={`text-lg sm:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Triagem Inteligente
                  </h1>
                </div>
                <p className={`text-xs sm:text-sm lg:text-base text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Converse com nossa IA e obtenha orientação médica personalizada
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-3 sm:px-4">
              {/* Ícone Central */}
              <div className="mb-4 sm:mb-8">
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                  <Bot className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>

              {/* Texto Central */}
              <div className="text-center mb-4 sm:mb-8">
                <h2 className={`text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Como está se sentindo hoje?
                </h2>
                <p className={`text-xs sm:text-base lg:text-lg max-w-xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Nossa IA médica irá fazer perguntas sobre seus sintomas para entender melhor seu caso e conectá-lo com o especialista adequado.
                </p>
              </div>

              {/* Botão Iniciar */}
              <button
                onClick={handleNovaTriagem}
                className="mb-4 sm:mb-12 px-4 py-2 sm:px-6 sm:py-3 text-white rounded-lg font-semibold transition-all shadow-md flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
                style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Iniciar Triagem
              </button>

              {/* Cards de Recursos */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-3xl">
                <div className={`rounded-lg sm:rounded-xl p-2 sm:p-6 text-center ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50'}`}>
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-3 ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                    <MessageSquare className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                  </div>
                  <p className={`text-[10px] sm:text-sm font-semibold ${darkMode ? 'text-blue-200' : 'text-gray-900'}`}>
                    Perguntas Personalizadas
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl p-2 sm:p-6 text-center ${darkMode ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50'}`}>
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-3 ${darkMode ? 'bg-purple-800' : 'bg-purple-100'}`}>
                    <Lightbulb className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                  </div>
                  <p className={`text-[10px] sm:text-sm font-semibold ${darkMode ? 'text-purple-200' : 'text-gray-900'}`}>
                    Orientações Inteligentes
                  </p>
                </div>

                <div className={`rounded-lg sm:rounded-xl p-2 sm:p-6 text-center ${darkMode ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-emerald-50'}`}>
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-3 ${darkMode ? 'bg-emerald-800' : 'bg-emerald-100'}`}>
                    <Calendar className={`w-4 h-4 sm:w-6 sm:h-6 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  </div>
                  <p className={`text-[10px] sm:text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-gray-900'}`}>
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
            <div className={`border-b px-2 sm:px-6 py-1 sm:py-4 flex items-center justify-between flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                  <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className={`font-bold text-xs sm:text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assistente de Triagem</h2>
                  <p className="text-[9px] sm:text-sm text-emerald-600 flex items-center gap-0.5">
                    <span className="w-1 h-1 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></span>
                    <span className="sm:hidden">Online</span>
                    <span className="hidden sm:inline">Online • Respondendo em tempo real</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-2">
                {/* Botão para abrir triagens anteriores - MOBILE */}
                <button
                  onClick={() => setShowTriagensSidebar(true)}
                  className={`lg:hidden p-1 sm:p-2 rounded-lg transition ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleFecharChat}
                  className={`px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-md transition font-medium text-[10px] sm:text-sm ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className={`flex-1 overflow-y-auto px-2 sm:px-6 py-1.5 sm:py-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="max-w-4xl mx-auto space-y-1 sm:space-y-4">
                {activeTriagem?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-1.5 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                        <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-lg sm:rounded-2xl px-2 py-1 sm:px-4 sm:py-3 text-[11px] sm:text-base ${
                        message.type === 'bot'
                          ? darkMode ? 'bg-gray-800 text-gray-100 shadow-sm border border-gray-700' : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                          : 'text-white shadow-sm'
                      }`}
                      style={message.type === 'user' ? { backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' } : {}}
                    >
                      <p className="leading-snug sm:leading-relaxed whitespace-pre-line">{message.text}</p>
                      <p className={`text-[9px] sm:text-xs mt-0.5 sm:mt-1 ${message.type === 'bot' ? (darkMode ? 'text-gray-500' : 'text-gray-400') : 'text-white/70'}`}>
                        {message.time}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        <User className={`w-3 h-3 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicador de digitação */}
                {isTyping && (
                  <div className="flex gap-1.5 sm:gap-3 justify-start">
                    <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(to right, #4FACFE 0%, #00F2FE 100%)' }}>
                      <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className={`rounded-lg sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-3 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botão para agendar consulta */}
                {especialidadeRecomendada && !mostrarCalendario && !isTyping && (
                  <div className="flex justify-center my-4">
                    <button
                      onClick={handleQueroAgendar}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      Sim, quero agendar uma consulta
                    </button>
                  </div>
                )}

                {/* Calendário de agendamento */}
                {mostrarCalendario && (
                  <div className="my-4">
                    <CalendarioAgendamento
                      darkMode={darkMode}
                      onAgendarConsulta={handleAgendarConsulta}
                      especialidade={especialidadeRecomendada}
                    />
                  </div>
                )}
                
                {/* Elemento para auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className={`border-t px-2 sm:px-6 py-1.5 sm:py-4 flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="max-w-4xl mx-auto flex gap-1.5 sm:gap-3 items-end">
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
                  className={`flex-1 px-2 py-1.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 placeholder-gray-400 focus:outline-none focus:ring-2 transition resize-none text-[11px] sm:text-base ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-900' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-400 focus:ring-blue-100'
                  }`}
                />
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!symptoms.trim()}
                  className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-all flex items-center justify-center flex-shrink-0 ${
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
      {/* Sidebar Direita - Triagens Anteriores */}
      <div className={`
        ${showTriagensSidebar ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        right-0 lg:right-auto
        top-0 lg:top-auto
        bottom-0 lg:bottom-auto
        h-full
        w-[90%] sm:w-96
        lg:w-80 xl:w-96
        rounded-l-xl lg:rounded-2xl
        shadow-2xl border-l lg:border
        flex flex-col
        overflow-hidden
        transition-transform duration-300
        z-50 lg:z-0
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        
          {/* Header da Sidebar */}
        <div className={`p-3 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-base sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Triagens Anteriores
            </h2>
            {/* Botão fechar - apenas mobile */}
            <button
              onClick={() => setShowTriagensSidebar(false)}
              className={`lg:hidden p-1.5 sm:p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Triagens */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
          {triagens.length === 0 ? (
            // Mensagem quando não há triagens
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <MessageSquare className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <p className={`text-xs sm:text-sm font-medium text-center mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nenhuma triagem por aqui
              </p>
              <p className={`text-[10px] sm:text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
                className={`w-full text-left p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all ${
                  triagem.id === activeTriagemId
                    ? darkMode ? 'border-blue-400 bg-blue-900/30 shadow-md' : 'border-blue-300 bg-blue-50 shadow-md'
                    : darkMode ? 'border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className={`font-semibold text-xs sm:text-sm line-clamp-1 flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {triagem.title}
                  </p>
                  {triagem.status === 'EM_ANDAMENTO' ? (
                    <span className="px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded flex-shrink-0 whitespace-nowrap">
                      EM ANDAMENTO
                    </span>
                  ) : (
                    <span className={`px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-xs font-bold rounded flex-shrink-0 ${
                      triagem.severity === 'ALTA' 
                        ? 'bg-red-100 text-red-700'
                        : triagem.severity === 'MÉDIA'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {triagem.severity}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] sm:text-xs mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {triagem.date}
                </p>
                <button
                  onClick={(e) => handleDeleteTriagem(triagem.id, e)}
                  className={`text-[10px] sm:text-xs transition ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
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