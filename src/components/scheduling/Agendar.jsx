import React, { useState } from 'react';
import { Calendar, ArrowLeft, Building2, Video, Clock, Stethoscope, CheckCircle2, AlertCircle, Sparkles, ChevronRight, X, ChevronDown, Check, Mail } from 'lucide-react';
import { enviarEmailConsultaAgendada } from '../../services/emailService';

export default function AgendarConsulta({ darkMode, onNavigate, onAgendarConsulta }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showMedicoDropdown, setShowMedicoDropdown] = useState(false);
  const [formData, setFormData] = useState({
    datetime: '',
    type: 'presencial',
    medico: '',
    motivo: '',
    especialidade: ''
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const steps = [
    { number: 1, title: 'Tipo e Data', icon: Calendar },
    { number: 2, title: 'Especialidade', icon: Stethoscope },
    { number: 3, title: 'Detalhes', icon: CheckCircle2 }
  ];

  const especialidades = [
    { id: 'clinico', name: 'Clínico Geral', icon: '🩺', desc: 'Consulta geral' },
    { id: 'cardio', name: 'Cardiologia', icon: '❤️', desc: 'Coração e sistema cardiovascular' },
    { id: 'ortopedia', name: 'Ortopedia', icon: '🦴', desc: 'Ossos e articulações' },
    { id: 'dermato', name: 'Dermatologia', icon: '✨', desc: 'Pele, cabelo e unhas' },
    { id: 'pediatria', name: 'Pediatria', icon: '👶', desc: 'Saúde infantil' },
    { id: 'gineco', name: 'Ginecologia', icon: '🌸', desc: 'Saúde da mulher' }
  ];

  const medicos = {
    clinico: [
      { id: 'dr-silva', name: 'Dr. João Silva', crm: 'CRM 12345', rating: 4.9, consultas: 1250 },
      { id: 'dra-costa', name: 'Dra. Ana Costa', crm: 'CRM 67890', rating: 4.8, consultas: 980 }
    ],
    cardio: [
      { id: 'dra-santos', name: 'Dra. Maria Santos', crm: 'CRM 54321', rating: 5.0, consultas: 2100 }
    ],
    ortopedia: [
      { id: 'dr-oliveira', name: 'Dr. Pedro Oliveira', crm: 'CRM 98765', rating: 4.7, consultas: 1500 }
    ]
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.datetime && !formData.type) {
        showNotification('error', 'Por favor, selecione a DATA/HORA e o TIPO DE CONSULTA (Presencial ou Online).');
        return;
      }
      if (!formData.datetime) {
        showNotification('error', 'Por favor, selecione a DATA E HORA da consulta no campo acima.');
        return;
      }
      
      // Validar se a data/hora não está no passado
      const selectedDateTime = new Date(formData.datetime);
      const now = new Date();
      
      if (selectedDateTime <= now) {
        showNotification('error', 'A data e hora da consulta devem ser no FUTURO. Por favor, selecione um horário posterior ao atual.');
        return;
      }
      
      if (!formData.type) {
        showNotification('error', 'Por favor, escolha o TIPO DE CONSULTA: Presencial ou Online.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.especialidade) {
        showNotification('error', 'Por favor, selecione uma ESPECIALIDADE MÉDICA (ex: Clínico Geral, Cardiologia, etc).');
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.motivo) {
      showNotification('error', 'Por favor, descreva o MOTIVO DA CONSULTA no campo de texto abaixo. Exemplo: "Dor de cabeça persistente há 3 dias".');
      return;
    }

    if (formData.motivo.length < 10) {
      showNotification('error', 'Por favor, descreva o motivo da consulta com mais detalhes (mínimo 10 caracteres).');
      return;
    }

    setIsLoading(true);
    
    try {
      // Obter dados do usuário logado
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Extrair data e hora do datetime
      const dateTime = new Date(formData.datetime);
      const data = dateTime.toISOString().split('T')[0];
      const hora = dateTime.toTimeString().split(' ')[0].substring(0, 5);
      
      // Criar objeto de consulta
      const novaConsulta = {
        id: Date.now(),
        paciente: userData.name || 'Paciente',
        medico: formData.medico || 'Automático',
        especialidade: formData.especialidade,
        dataHora: formData.datetime,
        data: data,
        hora: hora,
        tipo: formData.type,
        status: 'agendada',
        motivo: formData.motivo
      };

      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Enviar email de confirmação
      if (userData.email) {
        console.log('📧 Enviando email de confirmação...');
        const emailResult = await enviarEmailConsultaAgendada(userData, novaConsulta);
        
        if (emailResult.success) {
          console.log('✅ Email enviado com sucesso!');
        } else {
          console.warn('⚠️ Falha ao enviar email, mas consulta foi agendada');
        }
      }

      setIsLoading(false);
      
      // Chamar callback do App.jsx (mostrará a notificação)
      if (onAgendarConsulta) {
        onAgendarConsulta(novaConsulta);
      }
      
      // Mostrar notificação de email enviado
      showNotification('success', `📧 Email de confirmação enviado para ${userData.email || 'seu email'}`);
      
      // Redirecionar para Consultas após 2 segundos
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('consultas');
        }
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao agendar consulta:', error);
      showNotification('error', 'Erro ao agendar consulta. Tente novamente.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'} py-4 sm:py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Header com Gradiente Animado */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-2">
                Agendar Consulta
                <Sparkles className="w-6 h-6 animate-pulse" />
              </h1>
            </div>
            <p className="text-emerald-50 text-sm sm:text-base ml-0 sm:ml-16">
              Preencha os dados para marcar seu atendimento de forma rápida e segura
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : darkMode
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                    currentStep >= step.number
                      ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      : darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Formulário Multi-Step */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10`}>
          {/* Step 1: Tipo e Data */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Escolha o tipo e a data da consulta
                </h2>

                {/* Tipo de Consulta */}
                <div className="mb-8">
                  <label className={`block text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tipo de Atendimento <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, type: 'presencial' })}
                      className={`group relative p-6 rounded-2xl border-2 transition-all ${
                        formData.type === 'presencial'
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg shadow-emerald-500/20'
                          : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:shadow-lg'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${
                        formData.type === 'presencial'
                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                          : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <Building2 className={`w-8 h-8 ${formData.type === 'presencial' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <p className={`font-bold text-lg mb-2 ${formData.type === 'presencial' ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Presencial
                      </p>
                      <p className={`text-sm ${formData.type === 'presencial' ? 'text-emerald-700' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Atendimento na clínica
                      </p>
                      {formData.type === 'presencial' && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, type: 'online' })}
                      className={`group relative p-6 rounded-2xl border-2 transition-all ${
                        formData.type === 'online'
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg shadow-emerald-500/20'
                          : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:shadow-lg'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${
                        formData.type === 'online'
                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                          : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <Video className={`w-8 h-8 ${formData.type === 'online' ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <p className={`font-bold text-lg mb-2 ${formData.type === 'online' ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Online
                      </p>
                      <p className={`text-sm ${formData.type === 'online' ? 'text-emerald-700' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Teleconsulta por vídeo
                      </p>
                      {formData.type === 'online' && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Data e Horário */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Data e Horário <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.datetime}
                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full px-4 py-4 rounded-xl border-2 text-sm sm:text-base ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                    } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition`}
                    aria-label="Selecione data e horário"
                  />
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    💡 Clique no campo acima para abrir o calendário e escolher a data e hora
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Especialidade */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Selecione a especialidade médica
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {especialidades.map((esp) => (
                  <button
                    key={esp.id}
                    onClick={() => setFormData({ ...formData, especialidade: esp.id })}
                    className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                      formData.especialidade === esp.id
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg shadow-emerald-500/20'
                        : darkMode
                        ? 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:shadow-lg'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-3xl mb-3">{esp.icon}</div>
                    <p className={`font-bold text-base mb-1 ${formData.especialidade === esp.id ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {esp.name}
                    </p>
                    <p className={`text-sm ${formData.especialidade === esp.id ? 'text-emerald-700' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {esp.desc}
                    </p>
                    {formData.especialidade === esp.id && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Detalhes */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Complete os detalhes da consulta
              </h2>

              {/* Médico */}
              <div className="relative">
                <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                  Médico (Opcional)
                </label>
                
                {/* Dropdown Customizado */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMedicoDropdown(!showMedicoDropdown)}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 text-left text-sm sm:text-base flex items-center justify-between ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500'
                    } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition hover:border-emerald-400`}
                  >
                    <span className={!formData.medico ? (darkMode ? 'text-gray-400' : 'text-gray-500') : ''}>
                      {formData.medico 
                        ? medicos[formData.especialidade]?.find(m => m.id === formData.medico)?.name || 'Atribuir automaticamente'
                        : 'Atribuir automaticamente'
                      }
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showMedicoDropdown ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>

                  {/* Lista de opções */}
                  {showMedicoDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowMedicoDropdown(false)}
                      />
                      <div className={`absolute z-20 w-full mt-2 rounded-xl border-2 shadow-xl max-h-60 overflow-y-auto ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, medico: '' });
                            setShowMedicoDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm sm:text-base hover:bg-emerald-50 transition flex items-center justify-between ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-emerald-50'
                          } ${!formData.medico ? 'bg-emerald-50' : ''}`}
                        >
                          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                            Atribuir automaticamente
                          </span>
                          {!formData.medico && <Check className="w-5 h-5 text-emerald-600" />}
                        </button>
                        
                        {medicos[formData.especialidade]?.map((med) => (
                          <button
                            key={med.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, medico: med.id });
                              setShowMedicoDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm sm:text-base hover:bg-emerald-50 transition flex items-center justify-between border-t ${
                              darkMode 
                                ? 'hover:bg-gray-600 border-gray-600' 
                                : 'hover:bg-emerald-50 border-gray-100'
                            } ${formData.medico === med.id ? 'bg-emerald-50' : ''}`}
                          >
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {med.name}
                              </p>
                              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {med.crm} • {med.consultas} consultas
                              </p>
                            </div>
                            {formData.medico === med.id && <Check className="w-5 h-5 text-emerald-600" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  A clínica selecionará o melhor profissional disponível
                </p>
              </div>

              {/* Motivo */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Motivo da Consulta <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  placeholder="Exemplo: 'Estou com dor de cabeça intensa há 3 dias, principalmente pela manhã. Também sinto náuseas e sensibilidade à luz...'"
                  rows={5}
                  className={`w-full px-4 py-4 rounded-xl border-2 text-sm sm:text-base ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                  } focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition resize-none`}
                  aria-label="Descreva o motivo da consulta"
                />
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  💡 Seja específico: descreva os sintomas, quando começaram, intensidade e frequência
                </p>
              </div>

              {/* Aviso */}
              <div className={`p-4 rounded-xl border-2 flex gap-3 ${darkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  <strong>Lembre-se:</strong> Chegue com 15 minutos de antecedência. Para consultas online, você receberá o link por email.
                </p>
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } shadow-md hover:shadow-lg`}
              >
                Voltar
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Próximo
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-emerald-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmar Agendamento
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Resumo (se não estiver no step 1) */}
        {currentStep > 1 && (
          <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Resumo do Agendamento
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  {formData.type === 'presencial' ? <Building2 className="w-5 h-5 text-emerald-600" /> : <Video className="w-5 h-5 text-emerald-600" />}
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tipo</p>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formData.type === 'presencial' ? 'Presencial' : 'Online'}
                  </p>
                </div>
              </div>
              {formData.datetime && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data e Hora</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formData.datetime ? new Date(formData.datetime).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      }) : 'Não selecionada'}
                    </p>
                  </div>
                </div>
              )}
              {formData.especialidade && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Especialidade</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {especialidades.find(e => e.id === formData.especialidade)?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notificação Pop-up */}
      {notification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:min-w-[400px] z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`rounded-xl shadow-2xl p-4 flex items-start gap-3 ${
            notification.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base">
                {notification.type === 'success' ? 'Sucesso!' : 'Atenção!'}
              </p>
              <p className="text-sm mt-0.5 text-white/90">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}