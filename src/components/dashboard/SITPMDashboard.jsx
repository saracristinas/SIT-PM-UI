import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, Clipboard, Moon, LogOut, ArrowRight, X, Filter, Eye, HeartPulse } from 'lucide-react';

export default function SITPMDashboard({ onNavigate, darkMode, consultas = [] }) {
  const [showHistoricoModal, setShowHistoricoModal] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('todas') // 'todas', 'agendada', 'cancelada', 'concluida'
  const [selectedConsulta, setSelectedConsulta] = useState(null) // Consulta selecionada para ver detalhes

  // Controlar overflow do body quando modais estão abertos
  useEffect(() => {
    if (showHistoricoModal || selectedConsulta) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup quando o componente desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showHistoricoModal, selectedConsulta])

  // Encontrar próxima consulta agendada
  const proximaConsulta = consultas
    .filter(c => c.status === 'agendada')
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))[0]

  // Contar apenas consultas não canceladas e não perdidas
  const consultasAtivas = consultas.filter(c => c.status !== 'cancelada' && c.status !== 'nao_compareceu');
  const consultasAgendadas = consultas.filter(c => c.status === 'agendada');

  // Filtrar consultas para o histórico
  const consultasFiltradas = filtroStatus === 'todas' 
    ? consultasAtivas 
    : consultas.filter(c => c.status === filtroStatus)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8`}>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
              <HeartPulse className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Olá, Sara!</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 mt-1`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Bem-vindo ao seu portal de saúde inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => onNavigate('triagem')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Triagem com IA</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avaliação inteligente 24/7</p>
          </div>

          <div 
            onClick={() => onNavigate('agendar')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Agendar Consulta</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marque seu atendimento</p>
          </div>

          <div 
            onClick={() => onNavigate('consultas')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Minhas Consultas</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {consultasAgendadas.length} agendamento(s)
            </p>
          </div>

          <div 
            onClick={() => onNavigate('prontuario')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Meu Prontuário</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>0 registro(s)</p>
          </div>
        </div>

        {/* Próxima Consulta Agendada */}
        {proximaConsulta && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Próxima Consulta Agendada
              </h3>
            </div>
            
            <div className={`${darkMode ? 'bg-emerald-900/20 border-emerald-700' : 'bg-emerald-50 border-emerald-200'} border-2 rounded-xl p-6`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Data e Horário
                  </p>
                  <h4 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(proximaConsulta.dataHora).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })} às {new Date(proximaConsulta.dataHora).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </h4>
                  
                  <div className="space-y-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-medium">🩺 Médico:</span> {proximaConsulta.medico || 'A definir'}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-medium">📋 Motivo:</span> {proximaConsulta.motivo || 'Não especificado'}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      proximaConsulta.tipo === 'presencial'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {proximaConsulta.tipo === 'presencial' ? '🏥 Consulta Presencial' : '💻 Teleconsulta'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => onNavigate('consultas')}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition flex items-center gap-2"
                >
                  Ver Detalhes
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultas */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Histórico de Consultas</h3>
              </div>
              <button 
                onClick={() => setShowHistoricoModal(true)}
                className="text-emerald-600 text-sm font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>
            
            {consultasAtivas.length === 0 ? (
              <div 
                onClick={() => onNavigate('consultas')}
                className="flex flex-col items-center justify-center py-12 cursor-pointer hover:opacity-80 transition"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-emerald-600" />
                </div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nenhuma consulta agendada ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultasAtivas.slice(0, 3).map((consulta, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } hover:border-emerald-500 transition cursor-pointer`}
                    onClick={() => setSelectedConsulta(consulta)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {consulta.medico || 'Médico não especificado'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          {new Date(consulta.dataHora).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {consulta.motivo}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consulta.status === 'agendada'
                            ? 'bg-blue-500 text-white'
                            : consulta.status === 'concluida'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {consulta.status === 'agendada' ? 'Agendada' : consulta.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registros */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Registros Médicos</h3>
              </div>
              <button 
                onClick={() => onNavigate('prontuario')}
                className="text-emerald-600 text-sm font-medium hover:underline"
              >
                Ver todos
              </button>
            </div>
            
            <div 
              onClick={() => onNavigate('prontuario')}
              className="flex flex-col items-center justify-center py-12 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nenhum registro médico ainda</p>
            </div>
          </div>
        </div>

        {/* Modal de Histórico Completo */}
        {showHistoricoModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistoricoModal(false)}
          >
            <div 
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header do Modal */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Histórico Completo de Consultas
                  </h2>
                  <button
                    onClick={() => setShowHistoricoModal(false)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition`}
                  >
                    <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
                
                {/* Filtros */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setFiltroStatus('todas')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filtroStatus === 'todas'
                        ? 'bg-emerald-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="w-4 h-4 inline mr-2" />
                    Todas
                  </button>
                  <button
                    onClick={() => setFiltroStatus('agendada')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filtroStatus === 'agendada'
                        ? 'bg-blue-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Agendadas
                  </button>
                  <button
                    onClick={() => setFiltroStatus('concluida')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filtroStatus === 'concluida'
                        ? 'bg-green-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Concluídas
                  </button>
                  <button
                    onClick={() => setFiltroStatus('cancelada')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filtroStatus === 'cancelada'
                        ? 'bg-red-500 text-white'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Canceladas
                  </button>
                </div>
              </div>

              {/* Lista de Consultas */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {consultasFiltradas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className={`w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl flex items-center justify-center mb-4`}>
                      <Calendar className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nenhuma consulta {filtroStatus !== 'todas' ? filtroStatus : 'encontrada'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {consultasFiltradas.map((consulta, index) => (
                      <div
                        key={index}
                        className={`p-5 rounded-lg border ${
                          darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                        } hover:border-emerald-500 transition cursor-pointer`}
                        onClick={() => {
                          setShowHistoricoModal(false)
                          setSelectedConsulta(consulta)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {consulta.medico || 'Médico não especificado'}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  consulta.status === 'agendada'
                                    ? 'bg-blue-500 text-white'
                                    : consulta.status === 'concluida'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                }`}
                              >
                                {consulta.status === 'agendada' ? 'Agendada' : consulta.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                              </span>
                            </div>
                            
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                              📅 {new Date(consulta.dataHora).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })} às{' '}
                              {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              <span className="font-medium">Motivo:</span> {consulta.motivo}
                            </p>
                            
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                consulta.tipo === 'presencial'
                                  ? darkMode
                                    ? 'bg-emerald-900/50 text-emerald-300'
                                    : 'bg-emerald-100 text-emerald-700'
                                  : darkMode
                                  ? 'bg-purple-900/50 text-purple-300'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {consulta.tipo === 'presencial' ? '🏥 Presencial' : '💻 Teleconsulta'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalhes da Consulta */}
        {selectedConsulta && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedConsulta(null)}
          >
            <div 
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-2xl w-full`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Detalhes da Consulta
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Informações completas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConsulta(null)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition`}
                  >
                    <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedConsulta.status === 'agendada'
                          ? 'bg-blue-500 text-white'
                          : selectedConsulta.status === 'concluida'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {selectedConsulta.status === 'agendada' ? '📅 Agendada' : selectedConsulta.status === 'concluida' ? '✅ Concluída' : '❌ Cancelada'}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedConsulta.tipo === 'presencial'
                          ? darkMode
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-700'
                          : darkMode
                          ? 'bg-purple-900/50 text-purple-300'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {selectedConsulta.tipo === 'presencial' ? '🏥 Presencial' : '💻 Teleconsulta'}
                    </span>
                  </div>

                  {/* Data e Hora */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      📅 Data e Horário
                    </p>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedConsulta.dataHora).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })} às {new Date(selectedConsulta.dataHora).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Médico */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      🩺 Médico
                    </p>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedConsulta.medico || 'Não especificado'}
                    </p>
                  </div>

                  {/* Motivo */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      📋 Motivo da Consulta
                    </p>
                    <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedConsulta.motivo || 'Não especificado'}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelectedConsulta(null)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedConsulta(null)
                      onNavigate('consultas')
                    }}
                    className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                  >
                    Ver Todas Consultas
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}