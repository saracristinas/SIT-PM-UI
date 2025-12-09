import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, Eye, Trash2, X, Edit2, AlertTriangle, Plus, Video, Building2, Sparkles, Filter, Search, ChevronDown, MapPin, User, Check } from 'lucide-react';

export default function MinhasConsultas({ darkMode: darkModeProp, onNavigate, consultas: consultasProp = [], onEditarConsulta, onExcluirConsulta }) {
  const [darkMode, setDarkMode] = useState(darkModeProp || false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [editingConsulta, setEditingConsulta] = useState(null);
  const [deletingConsulta, setDeletingConsulta] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSugestaoTriagemModal, setShowSugestaoTriagemModal] = useState(false);

  // USA AS CONSULTAS DO PROP (vindo do App.jsx) ao invés de estado local
  const consultas = consultasProp;

  const consultasFiltradas = consultas.filter(c => {
    const matchStatus = filterStatus === 'todas' || c.status === filterStatus;
    const matchSearch = c.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch && c.status !== 'cancelada' && c.status !== 'nao_compareceu';
  });

  const consultasAgendadas = consultas.filter(c => c.status === 'agendada');
  const consultasConcluidas = consultas.filter(c => c.status === 'concluida');
  const consultasAtivas = consultas.filter(c => c.status !== 'cancelada' && c.status !== 'nao_compareceu');

  const stats = [
    { 
      label: 'Agendadas', 
      value: consultasAgendadas.length, 
      icon: Clock, 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-[#2663EB]'
    },
    { 
      label: 'Concluídas', 
      value: consultasConcluidas.length, 
      icon: CheckCircle, 
      color: 'blue',
      gradient: 'from-blue-400 to-cyan-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-[#059669]'
    },
    { 
      label: 'Total', 
      value: consultasAtivas.length, 
      icon: Calendar, 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-[#111828]'
    }
  ];

  const handleExcluir = (id) => {
    setIsDeleting(true);
    setTimeout(() => {
      // Chama a função do App.jsx para atualizar o estado global
      if (onExcluirConsulta) {
        onExcluirConsulta(id);
      }
      setIsDeleting(false);
      setDeletingConsulta(null);
    }, 1000);
  };

  const handleEditar = (id, data) => {
    setIsSaving(true);
    setTimeout(() => {
      // Chama a função do App.jsx para atualizar o estado global
      if (onEditarConsulta) {
        onEditarConsulta(id, data);
      }
      setIsSaving(false);
      setEditingConsulta(null);
      setEditForm({});
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'} py-6 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Premium */}
        <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-md">
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Minhas Consultas
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" />
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                  Gerencie seus agendamentos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-3 sm:p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgLight} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtros e Busca */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 mb-4 sm:mb-6`}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Buscar consultas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 sm:py-2.5 text-sm rounded-lg sm:rounded-xl border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
              />
            </div>

            {/* Filtro de Status - Dropdown Customizado */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`w-full sm:w-auto px-4 py-2 sm:py-2.5 text-sm rounded-lg sm:rounded-xl border font-medium flex items-center justify-between gap-2 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                } transition`}
              >
                <span>{filterStatus === 'todas' ? 'Todas' : filterStatus === 'agendada' ? 'Agendadas' : 'Concluídas'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  
                  {/* Menu */}
                  <div className={`absolute top-full mt-2 right-0 w-40 rounded-lg shadow-lg border z-20 overflow-hidden ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={() => {
                        setFilterStatus('todas');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition ${
                        filterStatus === 'todas'
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700'
                          : darkMode
                          ? 'text-white hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>Todas</span>
                      {filterStatus === 'todas' && <Check className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setFilterStatus('agendada');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition ${
                        filterStatus === 'agendada'
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700'
                          : darkMode
                          ? 'text-white hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>Agendadas</span>
                      {filterStatus === 'agendada' && <Check className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setFilterStatus('concluida');
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition ${
                        filterStatus === 'concluida'
                          ? darkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700'
                          : darkMode
                          ? 'text-white hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>Concluídas</span>
                      {filterStatus === 'concluida' && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Consultas */}
        {consultasFiltradas.length === 0 ? (
          /* Estado Vazio */
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-12`}>
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Calendar className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {searchTerm ? 'Nenhuma consulta encontrada' : 'Nenhuma consulta agendada'}
              </h3>
              <p className={`text-center mb-8 max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm 
                  ? 'Tente buscar com outros termos ou limpe os filtros'
                  : 'Comece agendando sua primeira consulta e tenha controle total dos seus atendimentos'}
              </p>
              
              {!searchTerm && (
                <button
                  onClick={() => setShowSugestaoTriagemModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Agendar Primeira Consulta
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Grid de Consultas */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {consultasFiltradas.map((consulta) => (
              <div
                key={consulta.id}
                className={`group relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-200`}
              >
                {/* Status Badge */}
                <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                  consulta.status === 'agendada'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {consulta.status === 'agendada' ? '📅 Agendada' : '✅ Concluída'}
                </div>

                <div className="p-3 sm:p-5">
                  {/* Header da Consulta */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      consulta.tipo === 'presencial'
                        ? 'bg-blue-500'
                        : 'bg-blue-500'
                    }`}>
                      {consulta.tipo === 'presencial' ? (
                        <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      ) : (
                        <Video className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-12">
                      <h3 className={`text-sm sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                        {new Date(consulta.dataHora).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </h3>
                      <p className="text-blue-600 font-semibold text-xs sm:text-sm flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Informações do Médico */}
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-emerald-50'} rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-bold text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                          {consulta.medico}
                        </p>
                        <p className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                          {consulta.especialidade} • {consulta.crm}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes compactos */}
                  <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                    <div className="flex items-start gap-1.5">
                      <MapPin className={`w-3 h-3 mt-0.5 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-1`}>
                        {consulta.local}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-1.5">
                      <svg className={`w-3 h-3 mt-0.5 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className={`text-[10px] sm:text-xs line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-medium">Motivo:</span> {consulta.motivo}
                      </p>
                    </div>
                  </div>

                  {/* Badge Tipo */}
                  <div className="mb-2 sm:mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                      consulta.tipo === 'presencial'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      {consulta.tipo === 'presencial' ? (
                        <>
                          <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Presencial
                        </>
                      ) : (
                        <>
                          <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Teleconsulta
                        </>
                      )}
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-2 sm:pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedConsulta(consulta)}
                      className={`flex-1 px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                        darkMode
                          ? 'bg-blue-900 text-blue-100 hover:bg-blue-800'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    
                    {consulta.status === 'agendada' && (
                      <>
                        <button
                          onClick={() => {
                            setEditingConsulta(consulta);
                            setEditForm({
                              dataHora: consulta.dataHora,
                              tipo: consulta.tipo,
                              medico: consulta.medico,
                              motivo: consulta.motivo
                            });
                          }}
                          className={`p-2 rounded-xl transition-all ${
                            darkMode
                              ? 'bg-blue-900 text-blue-100 hover:bg-blue-800'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                          title="Editar"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        
                        <button
                          onClick={() => setDeletingConsulta(consulta)}
                          className={`p-2 rounded-xl transition-all ${
                            darkMode
                              ? 'bg-red-900 text-red-100 hover:bg-red-800'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                          title="Cancelar"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedConsulta && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="sticky top-0 bg-emerald-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Detalhes da Consulta
                  </h3>
                  <button
                    onClick={() => setSelectedConsulta(null)}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition"
                    aria-label="Fechar"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Data e Hora */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-2xl p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Data e Horário
                      </p>
                      <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(selectedConsulta.dataHora).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric',
                          weekday: 'long'
                        })}
                      </p>
                      <p className="text-blue-600 font-semibold">
                        às {new Date(selectedConsulta.dataHora).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Médico */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-emerald-50'} rounded-2xl p-5`}>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Profissional
                      </p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedConsulta.medico}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedConsulta.especialidade} • {selectedConsulta.crm}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tipo e Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-4`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tipo
                    </p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedConsulta.tipo === 'presencial'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedConsulta.tipo === 'presencial' ? (
                        <>
                          <Building2 className="w-4 h-4" />
                          Presencial
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4" />
                          Online
                        </>
                      )}
                    </span>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-4`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status
                    </p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedConsulta.status === 'agendada'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedConsulta.status === 'agendada' ? '📅 Agendada' : '✅ Concluída'}
                    </span>
                  </div>
                </div>

                {/* Local */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-5`}>
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-5 h-5 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Local
                      </p>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedConsulta.local}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Motivo */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-5`}>
                  <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Motivo da Consulta
                  </p>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-900'} leading-relaxed`}>
                    {selectedConsulta.motivo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edição */}
        {editingConsulta && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="sticky top-0 bg-emerald-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-6 h-6" />
                    Editar Consulta
                  </h3>
                  <button
                    onClick={() => {
                      setEditingConsulta(null);
                      setEditForm({});
                    }}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition"
                    aria-label="Fechar"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Data e Horário */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Data e Horário <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.dataHora || ''}
                    onChange={(e) => setEditForm({ ...editForm, dataHora: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full px-4 py-4 rounded-xl border-2 text-base ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition`}
                    aria-label="Selecione nova data e horário"
                  />
                </div>

                {/* Tipo de Consulta */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tipo de Consulta <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setEditForm({ ...editForm, tipo: 'presencial' })}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        editForm.tipo === 'presencial'
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                          : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className={`w-8 h-8 mx-auto mb-2 ${editForm.tipo === 'presencial' ? 'text-emerald-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`font-semibold ${editForm.tipo === 'presencial' ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Presencial
                      </p>
                    </button>

                    <button
                      onClick={() => setEditForm({ ...editForm, tipo: 'online' })}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        editForm.tipo === 'online'
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                          : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Video className={`w-8 h-8 mx-auto mb-2 ${editForm.tipo === 'online' ? 'text-emerald-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`font-semibold ${editForm.tipo === 'online' ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Online
                      </p>
                    </button>
                  </div>
                </div>

                {/* Médico */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <User className="w-5 h-5 text-emerald-600" />
                    Médico (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editForm.medico || ''}
                    onChange={(e) => setEditForm({ ...editForm, medico: e.target.value })}
                    placeholder="Nome do médico"
                    className={`w-full px-4 py-4 rounded-xl border-2 text-base ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition`}
                    aria-label="Nome do médico"
                  />
                </div>

                {/* Motivo */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Motivo da Consulta <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editForm.motivo || ''}
                    onChange={(e) => setEditForm({ ...editForm, motivo: e.target.value })}
                    placeholder="Descreva o motivo da consulta..."
                    rows={4}
                    className={`w-full px-4 py-4 rounded-xl border-2 text-base ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition resize-none`}
                    aria-label="Motivo da consulta"
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingConsulta(null);
                      setEditForm({});
                    }}
                    disabled={isSaving}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (!editForm.dataHora || !editForm.motivo) {
                        alert('Por favor, preencha data/hora e motivo.');
                        return;
                      }
                      handleEditar(editingConsulta.id, editForm);
                    }}
                    disabled={isSaving}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSaving
                        ? 'bg-emerald-300 cursor-not-allowed'
                        : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {deletingConsulta && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl max-w-lg w-full`}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Cancelar Consulta
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-2xl p-5 mb-6 border-2 ${darkMode ? 'border-gray-600' : 'border-red-200'}`}>
                  <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    📋 Detalhes da consulta:
                  </p>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Data:</span>{' '}
                      {new Date(deletingConsulta.dataHora).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Horário:</span>{' '}
                      {new Date(deletingConsulta.dataHora).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Médico:</span> {deletingConsulta.medico}
                    </p>
                    <p className="flex items-center gap-2">
                      {deletingConsulta.tipo === 'presencial' ? (
                        <Building2 className="w-4 h-4 text-red-600" />
                      ) : (
                        <Video className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium">Tipo:</span>{' '}
                      {deletingConsulta.tipo === 'presencial' ? 'Presencial' : 'Online'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setDeletingConsulta(null)}
                    disabled={isDeleting}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Não, manter consulta
                  </button>
                  <button
                    onClick={() => handleExcluir(deletingConsulta.id)}
                    disabled={isDeleting}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isDeleting
                        ? 'bg-red-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105'
                    }`}
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Sim, cancelar consulta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Sugestão de Triagem com IA */}
        {showSugestaoTriagemModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`max-w-lg w-full rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6">
                {/* Header com ícone */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Precisa de ajuda para escolher?
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Temos uma assistente inteligente para te ajudar
                  </p>
                </div>

                {/* Benefícios da Triagem IA */}
                <div className={`rounded-xl p-4 mb-6 ${darkMode ? 'bg-emerald-900/20 border border-emerald-700' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <h4 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
                    <Sparkles className="w-5 h-5" />
                    Nossa Triagem com IA pode te ajudar:
                  </h4>
                  <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span><strong>Identificar a especialidade ideal</strong> baseado nos seus sintomas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span><strong>Descrever melhor seu caso</strong> para o médico entender</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span><strong>Fazer perguntas inteligentes</strong> sobre seus sintomas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span><strong>Agendar automaticamente</strong> após a triagem</span>
                    </li>
                  </ul>
                </div>

                {/* Botões de ação */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowSugestaoTriagemModal(false);
                      onNavigate('triagem');
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Sim, usar Triagem com IA
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowSugestaoTriagemModal(false);
                      onNavigate('agendar');
                    }}
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    Não, agendar manualmente
                  </button>

                  <button
                    onClick={() => setShowSugestaoTriagemModal(false)}
                    className={`w-full px-6 py-2 rounded-lg font-medium transition text-sm ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}