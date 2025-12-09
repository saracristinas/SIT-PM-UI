import React, { useState, useEffect } from 'react'
import { Check, Menu, X, Moon, HeartPulse } from 'lucide-react'
import Sidebar from './components/common/Sidebar'
import NotificacaoLembrete from './components/common/NotificacaoLembrete'
import ModalConfigurarLembretePosAgendamento from './components/common/ModalConfigurarLembretePosAgendamento'
import ModalConfirmarAtendimento from './components/common/ModalConfirmarAtendimento'
import SITPMDashboard from './components/dashboard/SITPMDashboard'
import TriagemIA from './components/medical/TriagemIA'
import Agendar from './components/scheduling/Agendar'
import Consultas from './components/scheduling/Consultas'
import Prontuario from './components/medical/Prontuario'
import Auth from './components/auth/Auth'
import { salvarConfiguracaoLembrete, agendarLembretes, deveEnviarLembrete, obterConfiguracaoLembrete } from './services/reminderService'
import { sendReminderEmail, sendCancellationEmail, sendModificationEmail } from './services/emailService'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('inicio')
  const [consultas, setConsultas] = useState([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', subtitle: '' })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [consultasPendentes, setConsultasPendentes] = useState([])
  const [showConfirmacaoModal, setShowConfirmacaoModal] = useState(false)
  
  // Notificações de lembretes
  const [notificacaoLembrete, setNotificacaoLembrete] = useState(null)
  const [showReminderConfig, setShowReminderConfig] = useState(false)
  const [consultaParaConfigurar, setConsultaParaConfigurar] = useState(null)
  const [showConfirmacaoAtendimento, setShowConfirmacaoAtendimento] = useState(false)
  const [consultaParaConfirmar, setConsultaParaConfirmar] = useState(null)

  // Carrega consultas do localStorage ao inicializar o app
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        localStorage.removeItem('user')
      }
    }
    
    // Carrega consultas do localStorage - Estas serão persistidas enquanto o usuário estiver logado
    const storedConsultas = localStorage.getItem('consultas')
    if (storedConsultas) {
      try {
        const parsed = JSON.parse(storedConsultas)
        setConsultas(parsed)
        console.log('✅ Consultas carregadas do localStorage:', parsed.length)
      } catch (error) {
        console.error('Erro ao carregar consultas:', error)
        setConsultas([])
      }
    } else {
      console.log('ℹ️ Nenhuma consulta encontrada no localStorage')
    }
    
    setIsLoading(false)
  }, [])

  // Salva consultas no localStorage sempre que mudam
  // Isto garante que as consultas agendadas NÃO desapareçam ao atualizar a página
  useEffect(() => {
    localStorage.setItem('consultas', JSON.stringify(consultas))
    console.log('📝 Consultas persistidas no localStorage:', consultas.length)
  }, [consultas])

  // Verifica consultas passadas que precisam de confirmação
  useEffect(() => {
    const agora = new Date();
    const consultasPassadas = consultas.filter(c => {
      if (c.status !== 'agendada') return false;
      const dataConsulta = new Date(c.dataHora);
      return dataConsulta < agora; // Consulta já passou
    });

    if (consultasPassadas.length > 0) {
      setConsultasPendentes(consultasPassadas);
      setShowConfirmacaoModal(true);
      
      // Mostra notificação de confirmação para a primeira consulta vencida não confirmada
      const primeiraPassada = consultasPassadas[0];
      setConsultaParaConfirmar(primeiraPassada);
      setShowConfirmacaoAtendimento(true);
    }
  }, [consultas, currentPage]); // Verifica quando mudar de página

  // Sistema de lembretes - Verifica se há consultas próximas (24h antes)
  useEffect(() => {
    const verificarLembretes = () => {
      const agora = new Date();
      const em24h = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

      consultas.forEach(consulta => {
        if (consulta.status === 'agendada' && consulta.lembreteEmail) {
          const dataConsulta = new Date(consulta.dataHora);
          
          // Se a consulta está entre agora e 24h, e ainda não enviou lembrete
          if (dataConsulta > agora && dataConsulta <= em24h && !consulta.lembreteEnviado) {
            // Marca que o lembrete foi enviado
            setConsultas(consultas.map(c => 
              c.id === consulta.id 
                ? { ...c, lembreteEnviado: true }
                : c
            ));

            // Envia o lembrete (simulado)
            console.log(`📧 Enviando lembrete para consulta: ${consulta.especialidade}`);
            
            setToastMessage({
              title: '📧 Lembrete enviado!',
              subtitle: `Você tem consulta amanhã às ${new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
            });
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 5000);
          }
        }
      });
    };

    // Verifica a cada 1 hora (em produção seria um cronjob no backend)
    const intervalo = setInterval(verificarLembretes, 60 * 60 * 1000);
    
    // Verifica imediatamente ao carregar
    verificarLembretes();

    return () => clearInterval(intervalo);
  }, [consultas]);

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    // Salvar email do usuário para envio de emails
    if (userData && userData.email) {
      localStorage.setItem('userEmail', userData.email)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('consultas')
    localStorage.removeItem('reminderConfig')
    localStorage.removeItem('reminderHistory')
    setUser(null)
    setConsultas([])
    setCurrentPage('inicio')
    setToastMessage({
      title: 'Você saiu do sistema',
      subtitle: 'Até logo!'
    })
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleAgendarConsulta = (novaConsulta) => {
    const consultaComId = {
      ...novaConsulta,
      id: novaConsulta.id || `consulta_${Date.now()}`,
      status: 'agendada',
      paciente: user,
      pacienteEmail: user?.email || localStorage.getItem('userEmail') || ''
    };

    // Atualiza o estado (que automaticamente salva no localStorage via useEffect)
    setConsultas([...consultas, consultaComId])
    
    // Configura lembretes automáticos para a consulta
    const configPadrao = {
      frequenciaMinutos: 30,
      antecedenciaHoras: 24,
      lembreteUrgente: 60,
      habilitado: true
    };
    salvarConfiguracaoLembrete(consultaComId.id, configPadrao);
    
    // Agenda os lembretes
    const lembretes = agendarLembretes(consultaComId, configPadrao);
    console.log('📅 Lembretes agendados para consulta:', {
      consultaId: consultaComId.id,
      medico: consultaComId.medico,
      dataHora: consultaComId.dataHora,
      lembretes: lembretes.length,
      proximoLembrete: lembretes[0]?.dataEnvio
    });

    // Inicia sistema de envio automático de lembretes (a cada 1 minuto)
    iniciarSistemaLembretes();
    
    // Mostrar modal de configuração de lembretes
    setConsultaParaConfigurar(consultaComId);
    setShowReminderConfig(true);
    
    // Mostrar toast
    setToastMessage({
      title: 'Consulta agendada com sucesso!',
      subtitle: `Você receberá lembretes a cada 30 minutos começando 24h antes da consulta.`
    })
    setShowSuccessToast(true)
    
    // Esconder após 5 segundos
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  // Sistema de lembretes automáticos
  const iniciarSistemaLembretes = () => {
    // Limpa intervalo anterior se existir
    if (window.lembretesInterval) {
      clearInterval(window.lembretesInterval)
    }

    // Verifica a cada 1 minuto se deve enviar lembretes
    window.lembretesInterval = setInterval(async () => {
      const consultasArmazenadas = JSON.parse(localStorage.getItem('consultas') || '[]');
      const consultasAgendadas = consultasArmazenadas.filter(c => c.status === 'agendada');
      
      console.log('🔍 Verificando lembretes... Consultas agendadas:', consultasAgendadas.length);
      
      for (const consulta of consultasAgendadas) {
        try {
          // Obtém configuração de lembrete para esta consulta
          const configuracao = obterConfiguracaoLembrete(consulta.id);

          // Se lembretes estão desabilitados, mas a consulta é online, enviar um único email com o link da sala virtual
          if (!configuracao.habilitado) {
            if (consulta.tipo === 'online') {
              const flagKey = `link_unico_enviado_${consulta.id}`;
              const jaEnviado = localStorage.getItem(flagKey);

              if (!jaEnviado) {
                console.log('📧 Enviando email único com link (lembretes desativados)...');
                const resultado = await sendReminderEmail(consulta, (notificacao) => {
                  setNotificacaoLembrete({
                    ...notificacao,
                    mensagem: notificacao.mensagem || `📧 Link da sala virtual enviado (opt-out de lembretes). Link: ${consulta.linkSalaOnline || consulta.link || consulta.urlSala || 'https://meet.google.com/tqf-txzf-pwb'}`
                  });
                });

                if (resultado.success) {
                  localStorage.setItem(flagKey, 'true');
                  console.log('✅ Email único com link enviado.');
                }
              }
            }
            continue; // pula envio recorrente porque lembretes estão desativados
          }
          
          // Obtém histórico de lembretes (timestamp do último envio)
          const historicoLembretesStr = localStorage.getItem(`lembrete_enviado_${consulta.id}`);
          const historicoLembretes = historicoLembretesStr ? new Date(historicoLembretesStr) : null;
          
          // Verifica se deve enviar baseado na frequência
          if (deveEnviarLembrete(historicoLembretes, configuracao.frequenciaMinutos)) {
            console.log(`📤 Enviando lembrete para consulta ${consulta.id} (frequência: ${configuracao.frequenciaMinutos}min)`);
            
            const resultado = await sendReminderEmail(consulta, (notificacao) => {
              console.log('📬 Callback recebido:', notificacao);
              // Mostra notificação no UI quando lembrete é enviado
              const linkSalaOnline = consulta.linkSalaOnline || consulta.link || consulta.urlSala || (consulta.tipo === 'online' ? 'https://meet.google.com/tqf-txzf-pwb' : '');
              setNotificacaoLembrete({
                ...notificacao,
                mensagem: `📧 Email de lembrete enviado! Faltam ${notificacao.tempoRestante} para sua consulta com ${notificacao.consultaInfo.medico}.${consulta.tipo === 'online' ? ` Link da sala: ${linkSalaOnline}` : ''}`
              });
            });
            
            // Salva timestamp do último lembrete enviado
            if (resultado.success) {
              localStorage.setItem(`lembrete_enviado_${consulta.id}`, new Date().toISOString());
              console.log('✅ Lembrete processado com sucesso');
            }
          } else {
            console.log(`⏭️ Pulando lembrete para ${consulta.medico} (aguardando frequência de ${configuracao.frequenciaMinutos}min)`);
          }
        } catch (error) {
          console.error('❌ Erro ao enviar lembrete para', consulta.medico, ':', error);
          console.error('Stack completo:', error.stack);
          
          // Mostra notificação de erro
          setNotificacaoLembrete({
            consultaInfo: {
              medico: consulta.medico,
              especialidade: consulta.especialidade,
              dataHora: consulta.dataHora
            },
            tempoRestante: '---',
            tipo: 'error',
            mensagem: `❌ Erro ao enviar lembrete: ${error.message}`
          });
        }
      }
    }, 60000); // Verifica a cada 1 minuto
  };

  // Inicia sistema de lembretes ao carregar o app
  useEffect(() => {
    const consultasArmazenadas = JSON.parse(localStorage.getItem('consultas') || '[]');
    const temConsultasAgendadas = consultasArmazenadas.some(c => c.status === 'agendada');
    
    if (temConsultasAgendadas) {
      iniciarSistemaLembretes();
    }

    // Limpa o intervalo ao desmontar o componente
    return () => {
      if (window.lembretesInterval) {
        clearInterval(window.lembretesInterval)
      }
    }
  }, [])

  const handleEditarConsulta = (consultaId, dadosAtualizados) => {
    const consultaAnterior = consultas.find(c => c.id === consultaId)
    
    setConsultas(consultas.map(consulta => 
      consulta.id === consultaId 
        ? { ...consulta, ...dadosAtualizados }
        : consulta
    ))
    
    // Se a data/hora foi modificada, envia email
    if (dadosAtualizados.dataHora && consultaAnterior.dataHora !== dadosAtualizados.dataHora) {
      const novaData = new Date(dadosAtualizados.dataHora).toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
      const novoHorario = new Date(dadosAtualizados.dataHora).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      sendModificationEmail(
        { ...consultaAnterior, ...dadosAtualizados },
        consultaAnterior.dataHora,
        novaData,
        novoHorario,
        (resultado) => {
          setNotificacaoLembrete(resultado)
          setTimeout(() => setNotificacaoLembrete(null), 6000)
        }
      )
    }
    
    // Mostrar toast
    setToastMessage({
      title: 'Consulta atualizada!',
      subtitle: 'As alterações foram salvas com sucesso.'
    })
    setShowSuccessToast(true)
    
    // Esconder após 5 segundos
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  const handleExcluirConsulta = (consultaId) => {
    const consultaParaCancelar = consultas.find(c => c.id === consultaId)
    
    setConsultas(consultas.map(consulta => 
      consulta.id === consultaId 
        ? { ...consulta, status: 'cancelada' }
        : consulta
    ))
    
    // Envia email de cancelamento
    if (consultaParaCancelar) {
      sendCancellationEmail(
        consultaParaCancelar,
        (resultado) => {
          setNotificacaoLembrete(resultado)
          setTimeout(() => setNotificacaoLembrete(null), 6000)
        }
      )
    }
    
    // Mostrar toast
    setToastMessage({
      title: 'Consulta cancelada!',
      subtitle: 'A consulta foi marcada como cancelada.'
    })
    setShowSuccessToast(true)
    
    // Esconder após 5 segundos
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  // Confirma que o usuário compareceu à consulta
  const handleConfirmarComparecimento = (consultaId) => {
    setConsultas(consultas.map(consulta =>
      consulta.id === consultaId
        ? { ...consulta, status: 'concluida' }
        : consulta
    ))
    
    // Remove da lista de pendentes
    setConsultasPendentes(consultasPendentes.filter(c => c.id !== consultaId))
    
    setToastMessage({
      title: 'Consulta confirmada!',
      subtitle: 'Obrigado por confirmar seu comparecimento.'
    })
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  // Não compareceu - oferece reagendamento
  const handleNaoCompareceu = (consultaId) => {
    setConsultas(consultas.map(consulta =>
      consulta.id === consultaId
        ? { ...consulta, status: 'nao_compareceu' }
        : consulta
    ))
    
    // Remove da lista de pendentes
    setConsultasPendentes(consultasPendentes.filter(c => c.id !== consultaId))
    
    // Redireciona para página de agendamento
    setCurrentPage('agendar')
    setShowConfirmacaoModal(false)
    
    setToastMessage({
      title: 'Vamos reagendar?',
      subtitle: 'Escolha uma nova data para sua consulta.'
    })
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <SITPMDashboard darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} />
      case 'triagem':
        return <TriagemIA darkMode={darkMode} onAgendarConsulta={handleAgendarConsulta} />
      case 'agendar':
        return <Agendar darkMode={darkMode} onNavigate={setCurrentPage} onAgendarConsulta={handleAgendarConsulta} />
      case 'consultas':
        return <Consultas darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} onEditarConsulta={handleEditarConsulta} onExcluirConsulta={handleExcluirConsulta} />
      case 'prontuario':
        return <Prontuario darkMode={darkMode} />
      default:
        return <SITPMDashboard darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} />
    }
  }

  // Loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não houver usuário logado, mostra tela de autenticação
  if (!user) {
    return <Auth darkMode={darkMode} onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#EFFDF9]'}`}>
      {/* Top Header Mobile/Tablet */}
      <div className={`fixed top-0 left-0 right-0 h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md z-40 lg:hidden`}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Center */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>SITPM</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            <Moon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />
      <div className="lg:ml-72 pt-16 lg:pt-0">
        {renderPage()}
      </div>

      {/* Toast de Sucesso Global */}
      {showSuccessToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-slide-in">
          <div className="bg-emerald-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm sm:min-w-[300px]">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">{toastMessage.title}</p>
              <p className="text-xs sm:text-sm text-emerald-100 truncate">{toastMessage.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Lembrete */}
      {notificacaoLembrete && (
        <NotificacaoLembrete
          mensagem={notificacaoLembrete.mensagem}
          tipo={notificacaoLembrete.tipo || 'success'}
          consultaInfo={notificacaoLembrete.consultaInfo}
          onClose={() => setNotificacaoLembrete(null)}
          duracao={8000}
        />
      )}

      {/* Modal de Configurar Lembrete após Agendamento */}
      {showReminderConfig && consultaParaConfigurar && (
        <ModalConfigurarLembretePosAgendamento
          consulta={consultaParaConfigurar}
          darkMode={darkMode}
          onClose={() => {
            setShowReminderConfig(false);
            setConsultaParaConfigurar(null);
          }}
          onSave={(config) => {
            console.log('✅ Lembretes configurados:', config);
          }}
        />
      )}

      {/* Modal de Confirmar Atendimento */}
      {showConfirmacaoAtendimento && consultaParaConfirmar && (
        <ModalConfirmarAtendimento
          consulta={consultaParaConfirmar}
          darkMode={darkMode}
          onClose={() => {
            setShowConfirmacaoAtendimento(false);
            setConsultaParaConfirmar(null);
          }}
          onConfirm={(consultaId) => {
            // Atualiza a consulta para concluída
            setConsultas(consultas.map(c => 
              c.id === consultaId ? { ...c, status: 'concluida' } : c
            ));
            
            setToastMessage({
              title: '✅ Consulta marcada como concluída!',
              subtitle: 'Os lembretes foram desativados.'
            });
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 5000);
          }}
        />
      )}

      {/* Modal de Confirmação de Comparecimento */}
      {showConfirmacaoModal && consultasPendentes.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Confirme seu Comparecimento
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Você teve consulta(s) agendada(s)
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {consultasPendentes.map((consulta) => (
                  <div 
                    key={consulta.id}
                    className={`p-4 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="mb-3">
                      <p className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {consulta.especialidade}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        📅 {new Date(consulta.dataHora).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })} às {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        🩺 {consulta.medico}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmarComparecimento(consulta.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                      >
                        ✓ Fui à consulta
                      </button>
                      <button
                        onClick={() => handleNaoCompareceu(consulta.id)}
                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition text-sm ${
                          darkMode 
                            ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
                        ✗ Não fui
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowConfirmacaoModal(false)}
                className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition text-sm ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
